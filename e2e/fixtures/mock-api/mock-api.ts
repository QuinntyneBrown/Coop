import type { BrowserContext, Route, Request } from "@playwright/test";
import {
  createSeedStore,
  newId,
  type MockAsset,
  type MockComment,
  type MockConversation,
  type MockDocument,
  type MockInvitation,
  type MockMaintenanceRequest,
  type MockMessage,
  type MockPage,
  type MockPageBlock,
  type MockPhoto,
  type MockPrivilege,
  type MockProfile,
  type MockStore,
  type MockUser,
  slugOf,
} from "./mock-store";
import {
  linkError as linkBlockError,
  photoError as photoBlockError,
  siteContentError,
} from "./site-content-rules";

export const API_ORIGIN = "http://localhost:5000";
export const API_BASE = `${API_ORIGIN}/api`;

export interface MockResponse {
  status: number;
  body?: unknown;
  /** Binary body (for example a photo) sent instead of JSON. */
  bytes?: Buffer;
  contentType?: string;
}

/** A 1x1 PNG served for every mock photo. */
const PHOTO_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

/** Photo rules shared with the API (L2-REQ-089). */
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** The blocks a request carries, else its body as one Existing content block (L2-REQ-123 AC4). */
function sectionsFrom(sections: unknown, body: unknown): MockPageBlock[] {
  if (Array.isArray(sections) && sections.length > 0)
    return sections as MockPageBlock[];
  const html = String(body ?? "");
  return html.trim() ? [{ kind: "html", html }] : [];
}

/** The API's block rules (PageBlockValidator, L2-REQ-123 AC3): the first problem, or null. */
function blockError(block: any): string | null {
  const text = String(block?.text ?? "");
  switch (block?.kind) {
    case "heading":
    case "paragraph":
      if (!text.trim())
        return `Fill in “${block.kind === "heading" ? "Heading" : "Paragraph"}”`;
      return text.length > 2000 ? "Text too long" : null;
    case "bullets":
      return Array.isArray(block.items) &&
        block.items.some((i: unknown) => String(i).trim())
        ? null
        : "Write at least one item";
    case "photo":
      return photoBlockError(block.photo);
    case "link":
      return linkBlockError(block);
    case "html":
      return String(block.html ?? "").trim()
        ? null
        : "Write something for the page";
    default:
      return "Unknown block kind";
  }
}

type Handler = (ctx: RequestContext, params: string[]) => MockResponse;

interface RouteEntry {
  method: string;
  route: string;
  pattern: RegExp;
  handler: Handler;
  anonymous?: boolean;
}

interface RequestContext {
  method: string;
  path: string;
  /** The query string, e.g. `draft=true` or `preview={token}`. */
  query: URLSearchParams;
  body: any;
  rawBody: string | null;
  user: MockUser | null;
}

const ok = (body: unknown = {}): MockResponse => ({ status: 200, body });
const notFound = (message = "Not found"): MockResponse => ({
  status: 404,
  body: { message },
});
const badRequest = (message: string): MockResponse => ({
  status: 400,
  body: { message },
});
const unauthorized = (): MockResponse => ({
  status: 401,
  body: { message: "Unauthorized" },
});
const forbidden = (): MockResponse => ({
  status: 403,
  body: { message: "Access denied." },
});

/** The office's roles; anyone else signed in is a member (L2-REQ-112, ADR 0016). */
export const OFFICE_ROLES = [
  "SystemAdministrator",
  "BoardMember",
  "Staff",
  "Support",
];

export const isOffice = (user: MockUser) => OFFICE_ROLES.includes(user.role);

/** Routes of the office areas: like the API, they answer a member with 403 (L2-REQ-113). */
const OFFICE_ROUTES = new Set([
  "GET user",
  "GET user/page/:size/:index",
  "GET user/:id",
  "POST user",
  "PUT user",
  "DELETE user/:id",
  "GET role",
  "GET role/page/:size/:index",
  "GET role/:id",
  "GET privilege",
  "POST privilege",
  "DELETE privilege/:id",
  "GET invitationtoken",
  "GET invitation-token/page/:size/:index",
  "GET invitation-token/:id",
  "POST invitationtoken",
  "PUT invitationtoken",
  "DELETE invitation-token/:id",
  "GET digitalasset/page/:size/:index",
  "GET digital-asset/page/:size/:index",
  "GET digital-asset/:id",
  "GET digital-assets/:id",
  "POST digitalasset/upload",
  "POST digital-assets",
  "DELETE digital-asset/:id",
  "DELETE digitalasset/:id",
  "GET members",
  "GET profiles/type/:type",
  "DELETE profiles/:id",
  "POST profile",
  "DELETE profile/:id",
  "POST notice",
  "POST notice/:id/send",
  "POST document",
  "PUT document",
  "PUT document/publish",
  "DELETE document/:id",
  "POST theme",
  "PUT theme",
  "PUT site-content",
  "POST site-content/publish",
  "DELETE site-content/draft",
  "POST site-content/preview-token",
  "PUT board-of-directors",
  "POST pages",
  "PUT pages",
  "DELETE pages/:id",
  "PUT maintenancerequest",
  "PUT maintenancerequest/receive",
  "PUT maintenancerequest/start",
  "PUT maintenancerequest/complete",
  "DELETE maintenancerequest/:id",
  "POST maintenancerequestdigitalasset",
]);

/** Roles whose seeded privilege on the Page aggregate reaches each access right. */
const PAGE_ROLES = {
  create: ["SystemAdministrator", "BoardMember"],
  write: ["SystemAdministrator", "BoardMember", "Staff", "Support"],
  delete: ["SystemAdministrator"],
};

/** Roles whose seeded privilege on the JsonContent aggregate reaches Write. */
const JSON_CONTENT_WRITE_ROLES = [
  "SystemAdministrator",
  "BoardMember",
  "Staff",
  "Support",
];

/** Roles whose seeded privilege on the Notice aggregate reaches Write. */
const NOTICE_WRITE_ROLES = [
  "SystemAdministrator",
  "BoardMember",
  "Staff",
  "Support",
];

const DOC_TYPES: Record<string, MockDocument["documentType"]> = {
  notice: "Notice",
  notices: "Notice",
  bylaw: "ByLaw",
  bylaws: "ByLaw",
  "by-law": "ByLaw",
  report: "Report",
  reports: "Report",
};

const DOC_TYPE_PLURAL: Record<MockDocument["documentType"], string> = {
  Notice: "notices",
  ByLaw: "bylaws",
  Report: "reports",
};

export function normalizeDocType(
  input: string | undefined,
): MockDocument["documentType"] {
  return DOC_TYPES[(input ?? "").toLowerCase()] ?? "Notice";
}

const PROFILE_TYPE_NAMES: Record<number, string> = {
  0: "Member",
  1: "BoardMember",
  2: "StaffMember",
};

/**
 * A fake Coop API that lives entirely in the test process. Install it on a
 * browser context to intercept every call to the real API origin.
 */
export class MockApi {
  readonly store: MockStore = createSeedStore();
  /** "METHOD path" or "METHOD route" (e.g. "POST notice/:id/send") entries that answer 500 until removed, to exercise error states. */
  readonly failing = new Set<string>();
  private readonly routes: RouteEntry[] = [];

  constructor() {
    this.registerRoutes();
  }

  // ── Public helpers used by fixtures ──────────────────────────────

  tokenFor(user: MockUser): string {
    return `mock-token:${user.userId}`;
  }

  login(
    username: string,
    password: string,
  ): { token: string; userId: string; username: string } {
    const user = this.store.users.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) throw new Error(`Mock login failed for "${username}"`);
    return {
      token: this.tokenFor(user),
      userId: user.userId,
      username: user.username,
    };
  }

  userByToken(token: string | null | undefined): MockUser | null {
    if (!token) return null;
    const id = token.replace(/^Bearer\s+/i, "").replace(/^mock-token:/, "");
    return this.store.users.find((u) => u.userId === id) ?? null;
  }

  /**
   * A preview token the public site may present for the next `minutes`
   * (L2-REQ-125, ADR 0019): `mock-preview:{expiry ms}`. A negative number
   * gives an expired one.
   */
  previewToken(minutes = 60): string {
    return `mock-preview:${Date.now() + minutes * 60_000}`;
  }

  previewTokenIsValid(token: string | null): boolean {
    const match = /^mock-preview:(\d+)$/.exec(token ?? "");
    return match !== null && Number(match[1]) > Date.now();
  }

  /** Writes the site content draft from a copy of the published content changed by `mutate` (L2-REQ-121). */
  saveDraft(mutate: (content: Record<string, any>) => void): void {
    const published = this.store.jsonContents.find(
      (j) => j.name === "SiteContent",
    );
    const content = JSON.parse(JSON.stringify(published?.content ?? {}));
    mutate(content);
    const existing = this.store.jsonContents.find(
      (j) => j.name === "SiteContentDraft",
    );
    if (existing) existing.content = content;
    else
      this.store.jsonContents.push({
        jsonContentId: newId(),
        name: "SiteContentDraft",
        content,
      });
  }

  /** Dispatch a request without a browser, as the given user. */
  call(
    method: string,
    path: string,
    body?: unknown,
    user: MockUser | null = null,
  ): MockResponse {
    const [cleanPath, search = ""] = path
      .replace(/^\/?api\//, "")
      .replace(/^\//, "")
      .split("?");
    const ctx: RequestContext = {
      method: method.toUpperCase(),
      path: cleanPath,
      query: new URLSearchParams(search),
      body,
      rawBody:
        body == null
          ? null
          : typeof body === "string"
            ? body
            : JSON.stringify(body),
      user,
    };
    return this.dispatch(ctx);
  }

  async install(context: BrowserContext): Promise<void> {
    await context.route(`${API_ORIGIN}/**`, (route) => this.handleRoute(route));
  }

  // ── Routing ──────────────────────────────────────────────────────

  private async handleRoute(route: Route): Promise<void> {
    const request = route.request();
    const origin = request.headers()["origin"] ?? "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Credentials": "true",
    };

    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: cors });
      return;
    }

    const response = this.dispatch(this.contextFrom(request));
    if (response.bytes) {
      await route.fulfill({
        status: response.status,
        headers: {
          ...cors,
          "Content-Type": response.contentType ?? "application/octet-stream",
        },
        body: response.bytes,
      });
      return;
    }
    await route.fulfill({
      status: response.status,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify(response.body ?? {}),
    });
  }

  private contextFrom(request: Request): RequestContext {
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api\//, "").replace(/^\//, "");
    const rawBody = request.postData();
    let body: any = null;
    const contentType = request.headers()["content-type"] ?? "";
    if (rawBody && contentType.includes("application/json")) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = null;
      }
    } else if (rawBody && contentType.includes("multipart/form-data")) {
      const match = /filename="([^"]+)"/.exec(rawBody);
      const type = /filename="[^"]+"\r?\nContent-Type: ([^\r\n]+)/.exec(
        rawBody,
      );
      body = {
        fileName: match?.[1] ?? "upload.bin",
        contentType: type?.[1] ?? "application/octet-stream",
        size: rawBody.length,
      };
    }
    return {
      method: request.method().toUpperCase(),
      path,
      query: url.searchParams,
      body,
      rawBody,
      user: this.userByToken(request.headers()["authorization"]),
    };
  }

  private dispatch(ctx: RequestContext): MockResponse {
    if (this.failing.has(`${ctx.method} ${ctx.path}`)) {
      return { status: 500, body: { message: "Simulated failure" } };
    }
    for (const entry of this.routes) {
      if (entry.method !== ctx.method) continue;
      const match = entry.pattern.exec(ctx.path);
      if (!match) continue;
      if (this.failing.has(`${entry.method} ${entry.route}`)) {
        return { status: 500, body: { message: "Simulated failure" } };
      }
      if (!entry.anonymous && !ctx.user) return unauthorized();
      if (
        ctx.user &&
        !isOffice(ctx.user) &&
        OFFICE_ROUTES.has(`${entry.method} ${entry.route}`)
      )
        return forbidden();
      return entry.handler(ctx, match.slice(1));
    }
    return notFound(`No mock for ${ctx.method} /api/${ctx.path}`);
  }

  private on(
    method: string,
    pattern: string,
    handler: Handler,
    anonymous = false,
  ): void {
    // ":id" segments become capture groups; the whole path must match.
    const source = pattern.replace(/:[a-zA-Z]+/g, "([^/]+)");
    this.routes.push({
      method,
      route: pattern,
      pattern: new RegExp(`^${source}$`),
      handler,
      anonymous,
    });
  }

  // ── Views (response shapes the apps understand) ──────────────────

  private userView(u: MockUser) {
    // Roles come back as role objects, the shape of the API's UserDto.
    const role = this.store.roles.find((r) => r.name === u.role);
    return {
      userId: u.userId,
      id: u.userId,
      username: u.username,
      roles: role ? [{ roleId: role.roleId, name: role.name }] : [],
      status: u.status,
    };
  }

  private profileView(p: MockProfile) {
    const user = this.store.users.find((u) => u.userId === p.userId);
    return {
      id: p.profileId,
      profileId: p.profileId,
      userId: p.userId,
      username: user?.username ?? "",
      firstName: p.firstname,
      lastName: p.lastname,
      firstname: p.firstname,
      lastname: p.lastname,
      email: p.email,
      phone: p.phoneNumber,
      phoneNumber: p.phoneNumber,
      unit: p.unit,
      type: p.type,
      profileType: PROFILE_TYPE_NAMES[p.type] ?? "Member",
      boardTitle: p.boardTitle ?? "",
      avatarUrl: p.avatarUrl,
      noticeByEmail: p.noticeByEmail ?? false,
      noticeByText: p.noticeByText ?? false,
      memberSince: p.memberSince,
      roles: user ? [user.role] : [],
    };
  }

  private roleView(roleId: string) {
    const role = this.store.roles.find((r) => r.roleId === roleId);
    if (!role) return null;
    return {
      ...role,
      privileges: this.store.privileges.filter((p) => p.roleId === roleId),
    };
  }

  private documentView(d: MockDocument) {
    return {
      documentId: d.documentId,
      id: d.documentId,
      name: d.name,
      title: d.name,
      documentType: d.documentType,
      type: DOC_TYPE_PLURAL[d.documentType],
      body: d.body,
      content: d.body,
      status: d.status,
      published: d.status === "Published",
      createdOn: d.createdOn,
      createdAt: d.createdOn,
      updatedAt: d.createdOn,
      sentOn: d.sentOn ?? null,
    };
  }

  private commentView(c: MockComment) {
    return {
      maintenanceRequestCommentId: c.maintenanceRequestCommentId,
      id: c.maintenanceRequestCommentId,
      maintenanceRequestId: c.maintenanceRequestId,
      body: c.body,
      content: c.body,
      createdBy: c.createdBy,
      authorName: c.createdBy,
      createdOn: c.createdOn,
      createdAt: c.createdOn,
    };
  }

  private photoUrl(p: MockPhoto): string {
    return `/api/maintenance-requests/${p.maintenanceRequestId}/photos/${p.photoId}`;
  }

  private maintenanceView(r: MockMaintenanceRequest) {
    const photos = this.store.photos.filter(
      (p) => p.maintenanceRequestId === r.maintenanceRequestId,
    );
    const comments = this.store.comments
      .filter((c) => c.maintenanceRequestId === r.maintenanceRequestId)
      .map((c) => this.commentView(c));
    return {
      maintenanceRequestId: r.maintenanceRequestId,
      id: r.maintenanceRequestId,
      title: r.title,
      description: r.description,
      status: r.status,
      priority: r.priority,
      category: r.category,
      unitNumber: r.unitNumber,
      phone: r.phone,
      unattendedEntry: r.unattendedEntry,
      requestedByName: r.requestedByName,
      requestedByProfileId: r.requestedByProfileId,
      date: r.date,
      createdOn: r.date,
      createdAt: r.date,
      updatedAt: r.date,
      comments,
      digitalAssets: photos.map((p) => ({
        maintenanceRequestDigitalAssetId: p.photoId,
        maintenanceRequestId: p.maintenanceRequestId,
        digitalAssetId: p.photoId,
        url: this.photoUrl(p),
      })),
      attachments: photos.map((p) => ({
        id: p.photoId,
        fileName: "Photo",
        url: this.photoUrl(p),
      })),
    };
  }

  private messageView(m: MockMessage) {
    const sender = this.store.users.find((u) => u.userId === m.senderUserId);
    const senderProfile = this.store.profiles.find(
      (p) => p.userId === m.senderUserId,
    );
    // Senders are named the way people know them: their profile name, else the username.
    const senderName =
      `${senderProfile?.firstname ?? ""} ${senderProfile?.lastname ?? ""}`.trim() ||
      sender?.username ||
      "Member";
    return {
      messageId: m.messageId,
      id: m.messageId,
      conversationId: m.conversationId,
      senderId: m.senderUserId,
      senderName,
      senderAvatarUrl: senderProfile?.avatarUrl ?? "",
      createdBy: senderName,
      body: m.body,
      content: m.body,
      createdOn: m.createdOn,
      createdAt: m.createdOn,
    };
  }

  private conversationView(c: MockConversation) {
    const messages = this.store.messages
      .filter((m) => m.conversationId === c.conversationId)
      .sort((a, b) => a.createdOn.localeCompare(b.createdOn));
    const last = messages[messages.length - 1];
    const participants = c.participantUserIds
      .map((id) => this.store.users.find((u) => u.userId === id))
      .filter((u): u is MockUser => !!u);
    return {
      conversationId: c.conversationId,
      id: c.conversationId,
      subject: c.subject,
      participantIds: c.participantUserIds,
      participantNames: participants.map((u) => u.username),
      participants: participants.map((u) => ({
        userId: u.userId,
        username: u.username,
      })),
      lastMessage: last?.body ?? "",
      preview: last?.body ?? "",
      lastMessageAt: last?.createdOn ?? c.createdOn,
      updatedOn: last?.createdOn ?? c.createdOn,
      createdOn: c.createdOn,
      unreadCount: messages.filter((m) => m.read === false).length,
    };
  }

  private invitationView(i: MockInvitation) {
    return { ...i, id: i.invitationTokenId, token: i.value };
  }

  private assetView(a: MockAsset) {
    return {
      ...a,
      id: a.digitalAssetId,
      fileName: a.name,
      contentLength: a.size,
      url: `${API_BASE}/digital-asset/serve/${a.digitalAssetId}`,
    };
  }

  private pageView(p: MockPage) {
    return { ...p };
  }

  // ── Store mutations shared by HTTP handlers and fixtures ─────────

  /**
   * Adds a page, or returns the page that already has the title's slug (ADR 0002).
   * A `body` without `sections` becomes one Existing content block; a page is
   * published unless told otherwise (L2-REQ-123).
   */
  createPage(data: {
    title: string;
    body?: string;
    sections?: MockPageBlock[];
    published?: boolean;
    heroImageUrl?: string | null;
    heroImageAlt?: string | null;
  }): MockPage {
    const slug = slugOf(data.title);
    const existing = this.store.pages.find((p) => p.slug === slug);
    if (existing) return existing;
    const page: MockPage = {
      pageId: newId(),
      title: data.title.trim(),
      slug,
      heroImageUrl: data.heroImageUrl?.trim() || null,
      heroImageAlt:
        (data.heroImageUrl?.trim() && data.heroImageAlt?.trim()) || null,
      sections: sectionsFrom(data.sections, data.body),
      published: data.published ?? true,
      createdOn: new Date().toISOString(),
    };
    this.store.pages.push(page);
    return page;
  }

  createUser(data: {
    username: string;
    password: string;
    role?: string;
  }): MockUser {
    const user: MockUser = {
      userId: newId(),
      username: data.username,
      password: data.password,
      role: data.role || "Member",
      status: "Active",
    };
    this.store.users.push(user);
    this.store.profiles.push({
      profileId: newId(),
      userId: user.userId,
      firstname: data.username,
      lastname: "Member",
      email: `${data.username}@example.test`,
      phoneNumber: "",
      unit: "",
      type: 0,
      avatarUrl: "",
      memberSince: new Date().toISOString(),
    });
    return user;
  }

  createDocument(data: {
    title: string;
    type?: string;
    content?: string;
    status?: string;
    published?: boolean;
  }): MockDocument {
    const published = data.status
      ? data.status === "Published"
      : (data.published ?? true);
    const doc: MockDocument = {
      documentId: newId(),
      name: data.title,
      documentType: normalizeDocType(data.type),
      body: data.content ?? "",
      status: published ? "Published" : "Draft",
      createdOn: new Date().toISOString(),
    };
    this.store.documents.push(doc);
    return doc;
  }

  createMaintenanceRequest(
    owner: MockUser,
    data: {
      title: string;
      description: string;
      priority?: string;
      category?: string;
      address?: string;
      unitNumber?: string;
      phone?: string;
      unattendedEntry?: boolean;
    },
  ): MockMaintenanceRequest {
    const profile = this.store.profiles.find((p) => p.userId === owner.userId);
    const request: MockMaintenanceRequest = {
      maintenanceRequestId: newId(),
      ownerUserId: owner.userId,
      title: data.title,
      description: data.description,
      status: "New",
      priority: data.priority || "Medium",
      category: data.category || "General",
      unitNumber: data.unitNumber || data.address || profile?.unit || "",
      phone: data.phone || profile?.phoneNumber || "",
      unattendedEntry: data.unattendedEntry ?? false,
      requestedByName: profile
        ? `${profile.firstname} ${profile.lastname}`
        : owner.username,
      requestedByProfileId: profile?.profileId ?? "",
      date: new Date().toISOString(),
    };
    this.store.maintenanceRequests.push(request);
    return request;
  }

  addComment(
    author: MockUser,
    maintenanceRequestId: string,
    body: string,
  ): MockComment {
    const comment: MockComment = {
      maintenanceRequestCommentId: newId(),
      maintenanceRequestId,
      body,
      createdBy: author.username,
      createdOn: new Date().toISOString(),
    };
    this.store.comments.push(comment);
    return comment;
  }

  createConversation(
    creator: MockUser,
    data: {
      subject: string;
      participantIds?: string[];
      initialMessage?: string;
    },
  ): MockConversation {
    const participants = new Set([
      creator.userId,
      ...(data.participantIds ?? []),
    ]);
    const conversation: MockConversation = {
      conversationId: newId(),
      subject: data.subject,
      participantUserIds: [...participants],
      createdOn: new Date().toISOString(),
    };
    this.store.conversations.push(conversation);
    if (data.initialMessage) {
      this.sendMessage(
        creator,
        conversation.conversationId,
        data.initialMessage,
      );
    }
    return conversation;
  }

  sendMessage(
    sender: MockUser,
    conversationId: string,
    body: string,
  ): MockMessage {
    const message: MockMessage = {
      messageId: newId(),
      conversationId,
      senderUserId: sender.userId,
      body,
      createdOn: new Date().toISOString(),
    };
    this.store.messages.push(message);
    return message;
  }

  createInvitation(data: {
    type?: number;
    value?: string;
    expirationDate?: string;
  }): MockInvitation {
    const invitation: MockInvitation = {
      invitationTokenId: newId(),
      value: data.value || "inv-" + newId().slice(-8),
      type: data.type ?? 0,
      expirationDate:
        data.expirationDate ||
        new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      redeemed: false,
    };
    this.store.invitations.push(invitation);
    return invitation;
  }

  createAsset(data: {
    fileName: string;
    size?: number;
    contentType?: string;
  }): MockAsset {
    const asset: MockAsset = {
      digitalAssetId: newId(),
      name: data.fileName,
      contentType: data.contentType || "application/octet-stream",
      size: data.size ?? 0,
      createdOn: new Date().toISOString(),
    };
    this.store.assets.push(asset);
    return asset;
  }

  createProfile(owner: MockUser, data: Record<string, any>): MockProfile {
    const profile: MockProfile = {
      profileId: newId(),
      userId: owner.userId,
      firstname: data.firstname || data.firstName || "",
      lastname: data.lastname || data.lastName || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || data.phone || "",
      unit: data.unit || "",
      type: typeof data.type === "number" ? data.type : 0,
      boardTitle: data.boardTitle,
      avatarUrl: "",
      memberSince: new Date().toISOString(),
    };
    this.store.profiles.push(profile);
    return profile;
  }

  // ── Route table ──────────────────────────────────────────────────

  private registerRoutes(): void {
    const s = this.store;
    const newestFirst = <T extends { [k: string]: any }>(
      items: T[],
      key: string,
    ): T[] =>
      [...items].sort((a, b) => String(b[key]).localeCompare(String(a[key])));

    // Authentication
    this.on(
      "POST",
      "user/token",
      (ctx) => {
        const { username, password } = ctx.body ?? {};
        const user = s.users.find(
          (u) => u.username === username && u.password === password,
        );
        if (!user)
          return {
            status: 401,
            body: { message: "Invalid username or password" },
          };
        return ok({
          token: this.tokenFor(user),
          accessToken: this.tokenFor(user),
          refreshToken: "",
          userId: user.userId,
          username: user.username,
          roles: [user.role],
        });
      },
      true,
    );

    this.on(
      "POST",
      "user/register",
      (ctx) => {
        const { invitationToken, username, password } = ctx.body ?? {};
        const invitation = s.invitations.find(
          (i) => i.value === invitationToken && !i.redeemed,
        );
        if (!invitation) return badRequest("Invalid invitation token");
        if (s.users.some((u) => u.username === username)) {
          return badRequest("Username is already taken");
        }
        invitation.redeemed = true;
        const user = this.createUser({ username, password });
        return ok({
          token: this.tokenFor(user),
          userId: user.userId,
          username: user.username,
        });
      },
      true,
    );

    const changePassword: Handler = (ctx) => {
      const { currentPassword, newPassword } = ctx.body ?? {};
      if (ctx.user!.password !== currentPassword)
        return badRequest("Current password is incorrect");
      ctx.user!.password = newPassword;
      return ok();
    };
    this.on("PUT", "user/password", changePassword);

    this.on("GET", "user/current", (ctx) =>
      ok({ user: this.userView(ctx.user!) }),
    );

    // The signed-in person's profile; the admin's My profile reads and saves the notice choice here.
    const ownProfiles = (user: MockUser) =>
      s.profiles.filter((p) => p.userId === user.userId);

    this.on("GET", "user/profile", (ctx) => {
      const profile = ownProfiles(ctx.user!)[0];
      return profile ? ok(this.profileView(profile)) : notFound();
    });
    this.on("PUT", "user/profile", (ctx) => {
      const profile = ownProfiles(ctx.user!)[0];
      if (!profile) return notFound();
      const b = ctx.body ?? {};
      if (b.firstName != null) profile.firstname = b.firstName;
      if (b.lastName != null) profile.lastname = b.lastName;
      if (b.email != null) profile.email = b.email;
      if (b.phone != null) profile.phoneNumber = b.phone;
      if (typeof b.noticeByEmail === "boolean")
        profile.noticeByEmail = b.noticeByEmail;
      if (typeof b.noticeByText === "boolean")
        profile.noticeByText = b.noticeByText;
      // Same shape as the API's PUT api/user/profile: only the editable fields.
      return ok({
        id: profile.profileId,
        username: ctx.user!.username,
        firstName: profile.firstname,
        lastName: profile.lastname,
        email: profile.email,
        phone: profile.phoneNumber,
        noticeByEmail: profile.noticeByEmail ?? false,
        noticeByText: profile.noticeByText ?? false,
      });
    });
    this.on("GET", "members", () =>
      ok({
        members: s.profiles
          .filter((p) => p.type === 0)
          .map((p) => this.profileView(p)),
      }),
    );

    // Users (admin)
    this.on("GET", "user", () =>
      ok({ users: s.users.map((u) => this.userView(u)) }),
    );
    this.on("GET", "user/page/:size/:index", (_ctx, [size, index]) => {
      const n = Number(size);
      const start = Number(index) * n;
      return ok({
        users: s.users.slice(start, start + n).map((u) => this.userView(u)),
        totalCount: s.users.length,
      });
    });
    this.on("GET", "user/:id", (_ctx, [id]) => {
      const user = s.users.find((u) => u.userId === id);
      return user ? ok({ user: this.userView(user) }) : notFound();
    });
    this.on("POST", "user", (ctx) => {
      const { username, password, role } = ctx.body ?? {};
      if (!username || !password)
        return badRequest("Username and password are required");
      const user = this.createUser({ username, password, role });
      return ok({ user: this.userView(user) });
    });
    this.on("PUT", "user", (ctx) => {
      const b = ctx.body ?? {};
      const user = s.users.find((u) => u.userId === (b.userId || b.id));
      if (!user) return notFound();
      if (b.username) user.username = b.username;
      if (b.role) user.role = b.role;
      if (b.status) user.status = b.status;
      return ok({ user: this.userView(user) });
    });
    this.on("DELETE", "user/:id", (_ctx, [id]) => {
      s.users = s.users.filter((u) => u.userId !== id);
      return ok();
    });

    // Roles and privileges
    this.on("GET", "role", () =>
      ok({ roles: s.roles.map((r) => this.roleView(r.roleId)) }),
    );
    this.on("GET", "role/page/:size/:index", () =>
      ok({ roles: s.roles.map((r) => this.roleView(r.roleId)) }),
    );
    this.on("GET", "role/:id", (_ctx, [id]) => {
      const role = this.roleView(id);
      return role ? ok({ role }) : notFound();
    });
    this.on("GET", "privilege", () => ok({ privileges: s.privileges }));
    this.on("POST", "privilege", (ctx) => {
      const { roleId, aggregate, accessRight } = ctx.body ?? {};
      const privilege: MockPrivilege = {
        privilegeId: newId(),
        roleId,
        aggregate,
        accessRight,
      };
      s.privileges.push(privilege);
      return ok({ privilege });
    });
    this.on("DELETE", "privilege/:id", (_ctx, [id]) => {
      s.privileges = s.privileges.filter((p) => p.privilegeId !== id);
      return ok();
    });

    // Documents (public app): the published by-laws, notices and reports, newest first (L2-REQ-126).
    const docs = () =>
      newestFirst(s.documents, "createdOn").map((d) => this.documentView(d));
    const publishedOf = (type: MockDocument["documentType"]) =>
      docs().filter((d) => d.documentType === type && d.published);
    this.on(
      "GET",
      "notice/published",
      () => ok({ notices: publishedOf("Notice") }),
      true,
    );
    this.on(
      "GET",
      "bylaw/published",
      () => ok({ byLaws: publishedOf("ByLaw") }),
      true,
    );
    this.on(
      "GET",
      "report/published",
      () => ok({ reports: publishedOf("Report") }),
      true,
    );

    // Documents (admin app)
    // Like the API, drafts are the office's: anyone else reads published documents only (L2-REQ-114).
    const readable = (user: MockUser | null) =>
      docs().filter((d) => (user && isOffice(user)) || d.published);
    this.on(
      "GET",
      "document",
      (ctx) => ok({ documents: readable(ctx.user) }),
      true,
    );
    this.on("GET", "document/type/:type", (_ctx, [type]) => {
      const wanted = normalizeDocType(type);
      return ok({ documents: docs().filter((d) => d.documentType === wanted) });
    });
    this.on("GET", "document/:id", (_ctx, [id]) => {
      const doc = s.documents.find((d) => d.documentId === id);
      return doc ? ok({ document: this.documentView(doc) }) : notFound();
    });
    this.on("POST", "document", (ctx) => {
      const b = ctx.body ?? {};
      const doc = this.createDocument({
        title: b.name || b.title || "",
        type: b.documentType || b.type,
        content: b.body || b.content,
        status: b.status || "Draft",
      });
      return ok({ document: this.documentView(doc) });
    });
    // Notices (admin app): create, and send once to the members who chose it (L2-REQ-093, ADR 0007).
    this.on("POST", "notice", (ctx) => {
      const b = ctx.body ?? {};
      const doc = this.createDocument({
        title: b.name || "",
        type: "Notice",
        content: b.body,
        status: "Draft",
      });
      return ok({ notice: this.documentView(doc) });
    });
    this.on("POST", "notice/:id/send", (ctx, [id]) => {
      if (!NOTICE_WRITE_ROLES.includes(ctx.user!.role)) return forbidden();
      const doc = s.documents.find((d) => d.documentId === id);
      if (!doc || doc.documentType !== "Notice" || doc.status !== "Published") {
        return badRequest("Only a published notice can be sent.");
      }
      if (!doc.sentOn) {
        const emails = new Set(
          s.profiles
            .filter((p) => p.noticeByEmail && p.email)
            .map((p) => p.email),
        );
        const phones = new Set(
          s.profiles
            .filter((p) => p.noticeByText && p.phoneNumber)
            .map((p) => p.phoneNumber),
        );
        emails.forEach((to) =>
          s.noticeMessages.push({
            documentId: id,
            channel: "email",
            to,
            text: `New notice: ${doc.name}`,
          }),
        );
        phones.forEach((to) =>
          s.noticeMessages.push({
            documentId: id,
            channel: "text",
            to,
            text: `New notice from the co-op: ${doc.name}. ${doc.body}`,
          }),
        );
        doc.sentOn = new Date().toISOString();
      }
      return ok({ notice: this.documentView(doc) });
    });
    this.on("PUT", "document/publish", (ctx) => {
      const doc = s.documents.find(
        (d) => d.documentId === ctx.body?.documentId,
      );
      if (!doc) return notFound();
      doc.status = "Published";
      return ok({ document: this.documentView(doc) });
    });
    this.on("PUT", "document", (ctx) => {
      const b = ctx.body ?? {};
      const doc = s.documents.find(
        (d) => d.documentId === (b.documentId || b.id),
      );
      if (!doc) return notFound();
      if (b.name || b.title) doc.name = b.name || b.title;
      if (b.body != null || b.content != null) doc.body = b.body ?? b.content;
      if (b.status) doc.status = b.status;
      return ok({ document: this.documentView(doc) });
    });
    this.on("DELETE", "document/:id", (_ctx, [id]) => {
      s.documents = s.documents.filter((d) => d.documentId !== id);
      return ok();
    });

    // Maintenance requests (public app)
    const requests = () => newestFirst(s.maintenanceRequests, "date");
    const findRequest = (id: string) =>
      s.maintenanceRequests.find((r) => r.maintenanceRequestId === id);
    const transition =
      (status: MockMaintenanceRequest["status"]): Handler =>
      (ctx) => {
        const request = findRequest(ctx.body?.maintenanceRequestId);
        if (!request) return notFound();
        request.status = status;
        return ok({ maintenanceRequest: this.maintenanceView(request) });
      };

    // Like the API: only the requesting household adds photos; the household
    // and the office read them; re-posting the same photo returns it (ADR 0005).
    this.on("POST", "maintenance-requests/:id/photos", (ctx, [id]) => {
      const request = findRequest(id);
      if (!request) return notFound();
      if (request.ownerUserId !== ctx.user!.userId) return forbidden();
      const {
        fileName = "photo.png",
        contentType = "image/png",
        size = 0,
      } = ctx.body ?? {};
      if (!PHOTO_TYPES.includes(contentType))
        return badRequest("Choose a JPEG, PNG or WebP photo.");
      if (size > MAX_PHOTO_BYTES)
        return badRequest("Choose a photo smaller than 10 MB.");
      const existing = s.photos.find(
        (p) =>
          p.maintenanceRequestId === id &&
          p.fileName === fileName &&
          p.size === size,
      );
      const photo: MockPhoto = existing ?? {
        photoId: newId(),
        maintenanceRequestId: id,
        fileName,
        contentType,
        size,
      };
      if (!existing) s.photos.push(photo);
      return ok({
        photo: {
          photoId: photo.photoId,
          name: photo.fileName,
          url: this.photoUrl(photo),
        },
      });
    });
    this.on(
      "GET",
      "maintenance-requests/:id/photos/:photoId",
      (ctx, [id, photoId]) => {
        const request = findRequest(id);
        const photo = s.photos.find(
          (p) => p.maintenanceRequestId === id && p.photoId === photoId,
        );
        if (!request || !photo) return notFound();
        if (request.ownerUserId !== ctx.user!.userId && !isOffice(ctx.user!))
          return forbidden();
        return { status: 200, bytes: PHOTO_PNG, contentType: "image/png" };
      },
    );

    // Maintenance requests (admin app). Like the API, a member sees only the
    // requests their household made, and their comments (L2-REQ-114).
    const visibleTo = (user: MockUser) =>
      requests().filter((r) => isOffice(user) || r.ownerUserId === user.userId);
    this.on("GET", "maintenancerequest", (ctx) =>
      ok({
        maintenanceRequests: visibleTo(ctx.user!).map((r) =>
          this.maintenanceView(r),
        ),
      }),
    );
    this.on("GET", "maintenancerequest/my", (ctx) =>
      ok({
        maintenanceRequests: requests()
          .filter((r) => r.ownerUserId === ctx.user!.userId)
          .map((r) => this.maintenanceView(r)),
      }),
    );
    this.on(
      "GET",
      "maintenancerequest/page/:size/:index",
      (ctx, [size, index]) => {
        const n = Number(size);
        const start = Number(index) * n;
        const visible = visibleTo(ctx.user!);
        return ok({
          maintenanceRequests: visible
            .slice(start, start + n)
            .map((r) => this.maintenanceView(r)),
          totalCount: visible.length,
        });
      },
    );
    this.on("PUT", "maintenancerequest/receive", transition("Received"));
    // Like the API: a step only follows the one before it, and re-posting a
    // step that already happened returns the request unchanged (ADR 0004).
    const lifecycle: MockMaintenanceRequest["status"][] = [
      "New",
      "Received",
      "Started",
      "Completed",
    ];
    const step =
      (status: MockMaintenanceRequest["status"], refusal: string): Handler =>
      (ctx) => {
        const request = findRequest(ctx.body?.maintenanceRequestId);
        if (!request) return notFound();
        const at = lifecycle.indexOf(request.status);
        const to = lifecycle.indexOf(status);
        if (at < to - 1) return badRequest(refusal);
        if (at === to - 1) request.status = status;
        return ok({ maintenanceRequest: this.maintenanceView(request) });
      };
    this.on(
      "PUT",
      "maintenancerequest/start",
      step("Started", "Only a received request can be started."),
    );
    this.on(
      "PUT",
      "maintenancerequest/complete",
      step("Completed", "Only a started request can be finished."),
    );
    this.on("GET", "maintenancerequest/:id", (ctx, [id]) => {
      const request = findRequest(id);
      if (!request) return notFound();
      if (!visibleTo(ctx.user!).includes(request)) return forbidden();
      return ok({ maintenanceRequest: this.maintenanceView(request) });
    });
    this.on("POST", "maintenancerequest", (ctx) => {
      const request = this.createMaintenanceRequest(ctx.user!, ctx.body ?? {});
      return ok({ maintenanceRequest: this.maintenanceView(request) });
    });
    this.on("PUT", "maintenancerequest", (ctx) => {
      const b = ctx.body ?? {};
      const request = findRequest(b.maintenanceRequestId || b.id);
      if (!request) return notFound();
      if (b.title) request.title = b.title;
      if (b.description != null) request.description = b.description;
      return ok({ maintenanceRequest: this.maintenanceView(request) });
    });
    this.on("DELETE", "maintenancerequest/:id", (_ctx, [id]) => {
      s.maintenanceRequests = s.maintenanceRequests.filter(
        (r) => r.maintenanceRequestId !== id,
      );
      return ok();
    });
    this.on("GET", "maintenancerequestcomment", (ctx) => {
      const visible = visibleTo(ctx.user!).map((r) => r.maintenanceRequestId);
      return ok({
        comments: s.comments
          .filter((c) => visible.includes(c.maintenanceRequestId))
          .map((c) => this.commentView(c)),
      });
    });
    this.on("POST", "maintenancerequestcomment", (ctx) => {
      const { maintenanceRequestId, body } = ctx.body ?? {};
      const request = findRequest(maintenanceRequestId);
      if (!request) return notFound();
      if (!visibleTo(ctx.user!).includes(request)) return forbidden();
      const comment = this.addComment(
        ctx.user!,
        maintenanceRequestId,
        body ?? "",
      );
      return ok({ comment: this.commentView(comment) });
    });
    this.on("POST", "maintenancerequestdigitalasset", (ctx) => {
      const asset = this.createAsset(ctx.body ?? { fileName: "photo.png" });
      return ok({ digitalAsset: this.assetView(asset) });
    });

    // Messaging
    const findConversation = (id: string) =>
      s.conversations.find((c) => c.conversationId === id);
    const messagesFor = (conversationId: string) =>
      s.messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => a.createdOn.localeCompare(b.createdOn))
        .map((m) => this.messageView(m));

    // Like the API, a member uses only the conversations they take part in (L2-REQ-114).
    const canUse = (user: MockUser, c: MockConversation) =>
      isOffice(user) || c.participantUserIds.includes(user.userId);
    this.on("GET", "conversations/by-profile/:id", (ctx) =>
      ok({
        conversations: newestFirst(s.conversations, "createdOn")
          .filter((c) => canUse(ctx.user!, c))
          .map((c) => this.conversationView(c)),
      }),
    );
    this.on("GET", "conversations/:id", (ctx, [id]) => {
      const conversation = findConversation(id);
      if (!conversation) return notFound();
      if (!canUse(ctx.user!, conversation)) return forbidden();
      return ok({ conversation: this.conversationView(conversation) });
    });
    this.on("POST", "conversations/:id/messages", (ctx, [id]) => {
      const conversation = findConversation(id);
      if (!conversation) return notFound();
      if (!canUse(ctx.user!, conversation)) return forbidden();
      const text = ctx.body?.content ?? ctx.body?.body ?? "";
      if (!text) return badRequest("Message body is required");
      const message = this.sendMessage(ctx.user!, id, text);
      return ok({ message: this.messageView(message) });
    });
    this.on("POST", "conversations", (ctx) => {
      const conversation = this.createConversation(
        ctx.user!,
        ctx.body ?? { subject: "" },
      );
      return ok({ conversation: this.conversationView(conversation) });
    });

    // Messaging (admin app)
    this.on("GET", "messages/by-conversation/:id", (ctx, [id]) => {
      const conversation = findConversation(id);
      if (conversation && !canUse(ctx.user!, conversation)) return forbidden();
      return ok({ messages: messagesFor(id) });
    });
    this.on("GET", "messages/unread-count/:id", () => ok({ count: 0 }));
    this.on(
      "POST",
      "messages/mark-conversation-read/:id/:profileId",
      (_ctx, [id]) => {
        if (!findConversation(id)) return notFound();
        s.messages
          .filter((m) => m.conversationId === id)
          .forEach((m) => (m.read = true));
        return ok({ success: true });
      },
    );

    // Website pages (L2-REQ-080, L2-REQ-081, L2-REQ-123): blocks, a Published flag,
    // published-only reads unless the office or a preview token asks
    const pageErrors = (b: any): string[] => {
      const errors: string[] = [];
      const title = String(b?.title ?? "");
      if (!title.trim()) errors.push("Give the page a title");
      else if (!slugOf(title))
        errors.push("The title needs at least one letter or number.");
      else if (title.length > 120) errors.push("The title is too long.");
      const alt = String(b?.heroImageAlt ?? "");
      if (String(b?.heroImageUrl ?? "").trim() && !alt.trim())
        errors.push("Describe this photo for people who cannot see it");
      if (alt.length > 250)
        errors.push("Keep the description under 250 characters");
      for (const block of b?.sections ?? []) {
        const error = blockError(block);
        if (error) errors.push(error);
      }
      return errors;
    };
    const seesUnpublished = (ctx: RequestContext) =>
      (ctx.user && isOffice(ctx.user)) ||
      this.previewTokenIsValid(ctx.query.get("preview"));
    const pagesSorted = () =>
      [...s.pages].sort((a, b) => a.createdOn.localeCompare(b.createdOn));
    this.on(
      "GET",
      "pages",
      (ctx) => {
        const all = seesUnpublished(ctx);
        return ok({
          pages: pagesSorted()
            .filter((p) => all || p.published)
            .map((p) => this.pageView(p)),
        });
      },
      true,
    );
    this.on(
      "GET",
      "pages/:slug",
      (ctx, [slug]) => {
        const page = s.pages.find((p) => p.slug === slug);
        return page && (page.published || seesUnpublished(ctx))
          ? ok({ page: this.pageView(page) })
          : notFound("Page not found.");
      },
      true,
    );
    this.on("POST", "pages", (ctx) => {
      if (!PAGE_ROLES.create.includes(ctx.user!.role)) return forbidden();
      const errors = pageErrors(ctx.body);
      if (errors.length) return badRequest(errors.join(" "));
      const b = ctx.body;
      return ok({
        page: this.pageView(
          this.createPage({
            title: b.title,
            body: b.body,
            sections: b.sections,
            published: b.published === true,
            heroImageUrl: b.heroImageUrl,
            heroImageAlt: b.heroImageAlt,
          }),
        ),
      });
    });
    this.on("PUT", "pages", (ctx) => {
      if (!PAGE_ROLES.write.includes(ctx.user!.role)) return forbidden();
      const b = ctx.body ?? {};
      const page = s.pages.find((p) => p.pageId === b.pageId);
      if (!page) return notFound("Page not found.");
      const errors = pageErrors(b);
      if (errors.length) return badRequest(errors.join(" "));
      const slug = slugOf(b.title);
      if (s.pages.some((p) => p.slug === slug && p.pageId !== page.pageId)) {
        return badRequest("A page with this title already exists.");
      }
      page.title = String(b.title).trim();
      page.slug = slug;
      page.heroImageUrl = String(b.heroImageUrl ?? "").trim() || null;
      page.heroImageAlt =
        (page.heroImageUrl && String(b.heroImageAlt ?? "").trim()) || null;
      page.sections = sectionsFrom(b.sections, b.body);
      page.published = b.published === true;
      return ok({ page: this.pageView(page) });
    });
    this.on("DELETE", "pages/:id", (ctx, [id]) => {
      if (!PAGE_ROLES.delete.includes(ctx.user!.role)) return forbidden();
      const page = s.pages.find((p) => p.pageId === id);
      if (!page) return notFound("Page not found.");
      s.pages = s.pages.filter((p) => p.pageId !== id);
      return ok({ page: this.pageView(page) });
    });

    // JSON content
    const jsonContentView = (name: string) => {
      const item = s.jsonContents.find(
        (j) => j.name.toLowerCase() === name.toLowerCase(),
      );
      if (!item) return notFound();
      return ok({
        jsonContent: {
          id: item.jsonContentId,
          jsonContentId: item.jsonContentId,
          name: item.name,
          content: item.content,
          json: JSON.stringify(item.content),
        },
      });
    };
    this.on(
      "GET",
      "json-content/name/:name",
      (_ctx, [name]) => jsonContentView(name),
      true,
    );

    // Site content (L2-REQ-094 to L2-REQ-100), stored as the SiteContent JSON content, with
    // its draft in SiteContentDraft, publishing, discarding and preview tokens (L2-REQ-121, L2-REQ-125)
    const siteContent = () =>
      s.jsonContents.find((j) => j.name === "SiteContent");
    const siteDraft = () =>
      s.jsonContents.find((j) => j.name === "SiteContentDraft");
    const removeDraft = () => {
      s.jsonContents = s.jsonContents.filter(
        (j) => j.name !== "SiteContentDraft",
      );
    };
    const publishedView = () => ({
      siteContent: siteContent()?.content ?? null,
      hasDraft: false,
    });
    this.on(
      "GET",
      "site-content",
      (ctx) => {
        if (ctx.query.get("draft") === "true") {
          if (!ctx.user) return unauthorized();
          if (!isOffice(ctx.user)) return forbidden();
          const draft = siteDraft();
          return ok(
            draft
              ? { siteContent: draft.content, hasDraft: true }
              : publishedView(),
          );
        }
        if (ctx.query.has("preview")) {
          if (!this.previewTokenIsValid(ctx.query.get("preview")))
            return forbidden();
          return ok({
            siteContent: (siteDraft() ?? siteContent())?.content ?? null,
          });
        }
        const entry = siteContent();
        return entry ? ok({ siteContent: entry.content }) : notFound();
      },
      true,
    );
    this.on("PUT", "site-content", (ctx) => {
      if (!JSON_CONTENT_WRITE_ROLES.includes(ctx.user!.role))
        return forbidden();
      const content = ctx.body?.siteContent;
      if (!content || typeof content !== "object")
        return badRequest("One or more fields are invalid.");
      const error = siteContentError(content);
      if (error) return badRequest(error);
      const existing = siteDraft();
      if (existing) existing.content = content;
      else
        s.jsonContents.push({
          jsonContentId: newId(),
          name: "SiteContentDraft",
          content,
        });
      return ok({ siteContent: content, hasDraft: true });
    });
    this.on("POST", "site-content/publish", (ctx) => {
      if (!JSON_CONTENT_WRITE_ROLES.includes(ctx.user!.role))
        return forbidden();
      const draft = siteDraft();
      if (draft) {
        const published = siteContent();
        if (published) published.content = draft.content;
        else
          s.jsonContents.push({
            jsonContentId: newId(),
            name: "SiteContent",
            content: draft.content,
          });
        removeDraft();
      }
      return ok(publishedView());
    });
    this.on("DELETE", "site-content/draft", (ctx) => {
      if (!JSON_CONTENT_WRITE_ROLES.includes(ctx.user!.role))
        return forbidden();
      removeDraft();
      return ok(publishedView());
    });
    this.on("POST", "site-content/preview-token", () =>
      ok({
        token: this.previewToken(),
        expiresOn: new Date(Date.now() + 60 * 60_000).toISOString(),
      }),
    );

    // Board of Directors list (L2-REQ-085, L2-REQ-086), stored as the BoardOfDirectors JSON content
    const boardContent = () =>
      s.jsonContents.find((j) => j.name === "BoardOfDirectors");
    const directorsView = () => {
      const members = boardContent()?.content["members"];
      return (Array.isArray(members) ? members : []).map((m: any) => ({
        name: String(m?.name ?? ""),
        title: String(m?.title ?? m?.role ?? ""),
        photoUrl: m?.photoUrl ?? null,
      }));
    };
    this.on(
      "GET",
      "board-of-directors",
      () => ok({ directors: directorsView() }),
      true,
    );
    this.on("PUT", "board-of-directors", (ctx) => {
      if (!JSON_CONTENT_WRITE_ROLES.includes(ctx.user!.role))
        return forbidden();
      const list = ctx.body?.directors;
      if (!Array.isArray(list))
        return badRequest("One or more fields are invalid.");
      const invalid = list.some((d: any) => {
        const name = String(d?.name ?? "").trim();
        const title = String(d?.title ?? "").trim();
        return (
          !name ||
          !title ||
          name.length > 100 ||
          title.length > 100 ||
          String(d?.photoUrl ?? "").length > 2048
        );
      });
      if (invalid) return badRequest("One or more fields are invalid.");
      const members = list.map((d: any) => ({
        name: String(d.name).trim(),
        title: String(d.title).trim(),
        photoUrl: String(d.photoUrl ?? "").trim() || null,
      }));
      const existing = boardContent();
      if (existing) existing.content = { members };
      else
        s.jsonContents.push({
          jsonContentId: newId(),
          name: "BoardOfDirectors",
          content: { members },
        });
      return ok({ directors: directorsView() });
    });

    // Units, theme
    this.on(
      "GET",
      "units",
      () =>
        ok([
          { id: "u-101", name: "Unit 101", number: "101" },
          { id: "u-204", name: "Unit 204", number: "204" },
          { id: "u-310", name: "Unit 310", number: "310" },
        ]),
      true,
    );
    this.on("GET", "theme", () => ok({}), true);
    this.on(
      "GET",
      "theme/default",
      () => {
        const theme = s.themes.find((t) => t.isDefault) ?? s.themes[0];
        return theme ? ok({ theme }) : notFound();
      },
      true,
    );
    this.on("POST", "theme", (ctx) => {
      const theme = {
        themeId: newId(),
        cssCustomProperties: ctx.body?.cssCustomProperties ?? "",
        isDefault: !!ctx.body?.isDefault,
      };
      if (theme.isDefault) s.themes.forEach((t) => (t.isDefault = false));
      s.themes.push(theme);
      return ok({ theme });
    });
    this.on("PUT", "theme", (ctx) => {
      const theme = s.themes.find((t) => t.themeId === ctx.body?.themeId);
      if (!theme) return notFound();
      theme.cssCustomProperties =
        ctx.body?.cssCustomProperties ?? theme.cssCustomProperties;
      return ok({ theme });
    });

    // Invitations
    const invitations = () => newestFirst(s.invitations, "expirationDate");
    this.on("GET", "invitationtoken", () =>
      ok({
        invitationTokens: invitations().map((i) => this.invitationView(i)),
      }),
    );
    this.on("GET", "invitation-token/page/:size/:index", () =>
      ok({
        invitationTokens: invitations().map((i) => this.invitationView(i)),
      }),
    );
    const validate: Handler = (_ctx, [value]) => {
      const invitation = s.invitations.find(
        (i) => i.value === value && !i.redeemed,
      );
      if (!invitation) return notFound("Invalid invitation token");
      return ok({
        ...this.invitationView(invitation),
        email: "",
        isValid: true,
      });
    };
    this.on("GET", "invitation-token/validate/:value", validate, true);
    this.on("GET", "invitation/validate/:value", validate, true);
    this.on("GET", "invitation-token/:id", (_ctx, [id]) => {
      const invitation = s.invitations.find((i) => i.invitationTokenId === id);
      return invitation
        ? ok({ invitationToken: this.invitationView(invitation) })
        : notFound();
    });
    this.on("POST", "invitationtoken", (ctx) => {
      const invitation = this.createInvitation(ctx.body ?? {});
      return ok({ invitationToken: this.invitationView(invitation) });
    });
    this.on("PUT", "invitationtoken", (ctx) => {
      const invitation = s.invitations.find(
        (i) => i.invitationTokenId === ctx.body?.invitationTokenId,
      );
      if (!invitation) return notFound();
      Object.assign(invitation, ctx.body);
      return ok({ invitationToken: this.invitationView(invitation) });
    });
    this.on("DELETE", "invitation-token/:id", (_ctx, [id]) => {
      s.invitations = s.invitations.filter((i) => i.invitationTokenId !== id);
      return ok();
    });

    // Digital assets
    const assets = () =>
      newestFirst(s.assets, "createdOn").map((a) => this.assetView(a));
    this.on("GET", "digitalasset/page/:size/:index", () =>
      ok({ digitalAssets: assets() }),
    );
    this.on("GET", "digital-asset/page/:size/:index", () =>
      ok({ digitalAssets: assets() }),
    );
    this.on("GET", "digital-asset/serve/:id", () => ok(), true);
    this.on("GET", "digital-asset/:id", (_ctx, [id]) => {
      const asset = s.assets.find((a) => a.digitalAssetId === id);
      return asset ? ok({ digitalAsset: this.assetView(asset) }) : notFound();
    });
    this.on("GET", "digital-assets/:id", (_ctx, [id]) => {
      const asset = s.assets.find((a) => a.digitalAssetId === id);
      return asset ? ok(this.assetView(asset)) : notFound();
    });
    this.on("POST", "digitalasset/upload", (ctx) => {
      const asset = this.createAsset(ctx.body ?? { fileName: "upload.bin" });
      return ok({ digitalAsset: this.assetView(asset) });
    });
    this.on("POST", "digital-assets", (ctx) => {
      const asset = this.createAsset(ctx.body ?? { fileName: "upload.bin" });
      return ok(this.assetView(asset));
    });
    this.on("DELETE", "digital-asset/:id", (_ctx, [id]) => {
      s.assets = s.assets.filter((a) => a.digitalAssetId !== id);
      return ok();
    });
    this.on("DELETE", "digitalasset/:id", (_ctx, [id]) => {
      s.assets = s.assets.filter((a) => a.digitalAssetId !== id);
      return ok();
    });

    // Profiles (admin app)
    this.on("GET", "profiles", (ctx) =>
      ok({ profiles: ownProfiles(ctx.user!).map((p) => this.profileView(p)) }),
    );
    this.on("GET", "profiles/type/:type", (_ctx, [type]) => {
      const wanted = Object.entries(PROFILE_TYPE_NAMES).find(
        ([, name]) => name.toLowerCase() === type.toLowerCase(),
      );
      const code = wanted ? Number(wanted[0]) : Number(type);
      return ok({
        profiles: s.profiles
          .filter((p) => p.type === code)
          .map((p) => this.profileView(p)),
      });
    });
    this.on("PUT", "profiles/avatar", () => ok());
    // Like the API: the owner and the office change a profile's picture; a
    // re-posted picture and a repeated removal change nothing (ADR 0006).
    const canChangePicture = (user: MockUser, profile: MockProfile) =>
      profile.userId === user.userId || isOffice(user);
    this.on("POST", "profiles/:id/avatar", (ctx, [id]) => {
      const profile = s.profiles.find((p) => p.profileId === id);
      if (!profile) return notFound();
      if (!canChangePicture(ctx.user!, profile)) return forbidden();
      const {
        fileName = "photo.png",
        contentType = "image/png",
        size = 0,
      } = ctx.body ?? {};
      if (!PHOTO_TYPES.includes(contentType))
        return badRequest("Choose a JPEG, PNG or WebP photo.");
      if (size < 1 || size > MAX_PHOTO_BYTES)
        return badRequest("Choose a photo smaller than 10 MB.");
      const same =
        profile.avatarFile?.fileName === fileName &&
        profile.avatarFile?.size === size;
      if (!same) {
        profile.avatarUrl = `/api/digitalasset/serve/${newId()}`;
        profile.avatarFile = { fileName, size };
      }
      return ok({ profile: this.profileView(profile) });
    });
    this.on("DELETE", "profiles/:id/avatar", (ctx, [id]) => {
      const profile = s.profiles.find((p) => p.profileId === id);
      if (!profile) return notFound();
      if (!canChangePicture(ctx.user!, profile)) return forbidden();
      profile.avatarUrl = "";
      profile.avatarFile = undefined;
      return ok({ profile: this.profileView(profile) });
    });
    this.on(
      "GET",
      "digitalasset/serve/:id",
      (_ctx, [id]) =>
        s.profiles.some((p) => p.avatarUrl.endsWith(`/${id}`)) ||
        s.assets.some(
          (a) => a.digitalAssetId === id && a.contentType.startsWith("image/"),
        )
          ? { status: 200, bytes: PHOTO_PNG, contentType: "image/png" }
          : notFound(),
      true,
    );
    this.on("GET", "profiles/:id", (_ctx, [id]) => {
      const profile = s.profiles.find((p) => p.profileId === id);
      return profile ? ok({ profile: this.profileView(profile) }) : notFound();
    });
    this.on("DELETE", "profiles/:id", (_ctx, [id]) => {
      s.profiles = s.profiles.filter((p) => p.profileId !== id);
      return ok();
    });
    this.on("POST", "members", (ctx) => {
      const profile = this.createProfile(ctx.user!, ctx.body ?? {});
      return ok({ member: this.profileView(profile) });
    });
    this.on("PUT", "members", (ctx) => {
      const b = ctx.body ?? {};
      const profile = s.profiles.find(
        (p) => p.profileId === (b.profileId || b.id),
      );
      if (!profile) return notFound();
      if (b.firstname || b.firstName)
        profile.firstname = b.firstname || b.firstName;
      if (b.lastname || b.lastName) profile.lastname = b.lastname || b.lastName;
      if (b.email != null) profile.email = b.email;
      if (b.phoneNumber != null || b.phone != null)
        profile.phoneNumber = b.phoneNumber ?? b.phone;
      if (b.boardTitle != null) profile.boardTitle = b.boardTitle;
      return ok({ member: this.profileView(profile) });
    });
    this.on("POST", "profile", (ctx) => {
      const profile = this.createProfile(ctx.user!, ctx.body ?? {});
      return ok({ profile: this.profileView(profile) });
    });
    this.on("DELETE", "profile/:id", (_ctx, [id]) => {
      s.profiles = s.profiles.filter((p) => p.profileId !== id);
      return ok();
    });
  }
}
