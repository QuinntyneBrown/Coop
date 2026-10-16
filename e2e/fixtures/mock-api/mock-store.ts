import { createSiteContent } from './site-content-seed';

/**
 * In-memory data for the mocked backend. One store is created per test, so
 * tests never share state and never need a running API or database.
 *
 * All records are fictional.
 */

export interface MockUser {
  userId: string;
  username: string;
  password: string;
  role: string;
  status: string;
}

export interface MockProfile {
  profileId: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  unit: string;
  type: number; // 0 Member, 1 BoardMember, 2 StaffMember
  boardTitle?: string;
  avatarUrl: string;
  /** The current picture's file, compared to treat a re-post as a retry (ADR 0006). */
  avatarFile?: { fileName: string; size: number };
  /** The member's choice of how new notices reach them (L2-REQ-092); unset means not chosen. */
  noticeByEmail?: boolean;
  noticeByText?: boolean;
  memberSince: string;
}

export interface MockPrivilege {
  privilegeId: string;
  roleId: string;
  aggregate: string;
  accessRight: number; // 1 Read, 2 Write, 3 Create, 4 Delete
}

export interface MockRole {
  roleId: string;
  name: string;
}

export interface MockDocument {
  documentId: string;
  name: string;
  documentType: 'Notice' | 'ByLaw' | 'Report';
  body: string;
  status: 'Published' | 'Draft';
  createdOn: string;
  /** When a notice was sent to members; it is sent once (ADR 0007). */
  sentOn?: string;
}

/** A message the mock "sent" for a notice, kept instead of leaving the test. */
export interface MockNoticeMessage {
  documentId: string;
  channel: 'email' | 'text';
  to: string;
  text: string;
}

export interface MockMaintenanceRequest {
  maintenanceRequestId: string;
  ownerUserId: string;
  title: string;
  description: string;
  status: 'New' | 'Received' | 'Started' | 'Completed';
  priority: string;
  category: string;
  unitNumber: string;
  phone: string;
  unattendedEntry: boolean;
  requestedByName: string;
  requestedByProfileId: string;
  date: string;
}

/** A photo a member attached to their maintenance request (L2-REQ-089). */
export interface MockPhoto {
  photoId: string;
  maintenanceRequestId: string;
  fileName: string;
  contentType: string;
  size: number;
}

export interface MockComment {
  maintenanceRequestCommentId: string;
  maintenanceRequestId: string;
  body: string;
  createdBy: string;
  createdOn: string;
}

export interface MockConversation {
  conversationId: string;
  subject: string;
  participantUserIds: string[];
  createdOn: string;
}

export interface MockMessage {
  messageId: string;
  conversationId: string;
  senderUserId: string;
  body: string;
  createdOn: string;
  /** Unread messages count towards a conversation's unread badge. */
  read?: boolean;
}

export interface MockInvitation {
  invitationTokenId: string;
  value: string;
  type: number;
  expirationDate: string;
  redeemed: boolean;
}

export interface MockAsset {
  digitalAssetId: string;
  name: string;
  contentType: string;
  size: number;
  createdOn: string;
}

export interface MockJsonContent {
  jsonContentId: string;
  name: string;
  content: Record<string, unknown>;
}

export interface MockPage {
  pageId: string;
  title: string;
  slug: string;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  body: string;
  createdOn: string;
}

export interface MockTheme {
  themeId: string;
  cssCustomProperties: string;
  isDefault: boolean;
}

export interface MockStore {
  users: MockUser[];
  profiles: MockProfile[];
  roles: MockRole[];
  privileges: MockPrivilege[];
  documents: MockDocument[];
  noticeMessages: MockNoticeMessage[];
  maintenanceRequests: MockMaintenanceRequest[];
  comments: MockComment[];
  photos: MockPhoto[];
  conversations: MockConversation[];
  messages: MockMessage[];
  invitations: MockInvitation[];
  assets: MockAsset[];
  jsonContents: MockJsonContent[];
  pages: MockPage[];
  themes: MockTheme[];
}

let counter = 0;

/** Deterministic, unique, GUID-shaped ids. */
export function newId(): string {
  counter += 1;
  const hex = counter.toString(16).padStart(12, '0');
  return `00000000-0000-4000-8000-${hex}`;
}

/** The URL slug the API derives from a page title (see Page.SlugFrom in the backend). */
export function slugOf(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

export const ADMIN_ID = 'a0000000-0000-4000-8000-000000000001';
export const MEMBER_ID = 'a0000000-0000-4000-8000-000000000002';
export const ADMIN_PROFILE_ID = 'b0000000-0000-4000-8000-000000000001';
export const MEMBER_PROFILE_ID = 'b0000000-0000-4000-8000-000000000002';

const ROLE_IDS: Record<string, string> = {
  SystemAdministrator: 'c0000000-0000-4000-8000-000000000001',
  BoardMember: 'c0000000-0000-4000-8000-000000000002',
  Staff: 'c0000000-0000-4000-8000-000000000003',
  Member: 'c0000000-0000-4000-8000-000000000004',
  Support: 'c0000000-0000-4000-8000-000000000005',
};

const ALL_AGGREGATES = [
  'User',
  'MaintenanceRequest',
  'Notice',
  'ByLaw',
  'Report',
  'Member',
  'BoardMember',
  'StaffMember',
];

function privilegesFor(roleName: string, rights: Record<string, number[]>): MockPrivilege[] {
  const out: MockPrivilege[] = [];
  for (const [aggregate, accessRights] of Object.entries(rights)) {
    for (const accessRight of accessRights) {
      out.push({ privilegeId: newId(), roleId: ROLE_IDS[roleName], aggregate, accessRight });
    }
  }
  return out;
}

function allRights(rights: number[]): Record<string, number[]> {
  return Object.fromEntries(ALL_AGGREGATES.map((a) => [a, rights]));
}

export function createSeedStore(): MockStore {
  const users: MockUser[] = [
    { userId: ADMIN_ID, username: 'admin', password: 'Admin123!', role: 'SystemAdministrator', status: 'Active' },
    { userId: MEMBER_ID, username: 'member', password: 'Member123!', role: 'Member', status: 'Active' },
    { userId: newId(), username: 'board', password: 'Board123!', role: 'BoardMember', status: 'Active' },
    { userId: newId(), username: 'staff', password: 'Staff123!', role: 'Staff', status: 'Active' },
    { userId: newId(), username: 'support', password: 'Support123!', role: 'Support', status: 'Disabled' },
  ];

  const profiles: MockProfile[] = [
    {
      profileId: ADMIN_PROFILE_ID,
      userId: ADMIN_ID,
      firstname: 'Avery',
      lastname: 'Fielding',
      email: 'avery.fielding@example.test',
      phoneNumber: '555-0101',
      unit: 'Office',
      type: 2,
      avatarUrl: '',
      memberSince: '2019-03-01T00:00:00.000Z',
    },
    {
      profileId: newId(),
      userId: ADMIN_ID,
      firstname: 'Beatrice',
      lastname: 'Hollis',
      email: 'beatrice.hollis@example.test',
      phoneNumber: '555-0102',
      unit: '310',
      type: 1,
      boardTitle: 'President',
      avatarUrl: '',
      memberSince: '2017-06-15T00:00:00.000Z',
    },
    {
      profileId: MEMBER_PROFILE_ID,
      userId: MEMBER_ID,
      firstname: 'Margaret',
      lastname: 'Okafor',
      email: 'margaret.okafor@example.test',
      phoneNumber: '555-0204',
      unit: '204',
      type: 0,
      avatarUrl: '',
      memberSince: '2021-09-01T00:00:00.000Z',
    },
    {
      profileId: newId(),
      userId: users[2].userId,
      firstname: 'Rosalind',
      lastname: 'Petrov',
      email: 'rosalind.petrov@example.test',
      phoneNumber: '555-0305',
      unit: '305',
      type: 1,
      boardTitle: 'Treasurer',
      avatarUrl: '',
      memberSince: '2018-01-10T00:00:00.000Z',
    },
    {
      profileId: newId(),
      userId: users[3].userId,
      firstname: 'Dolores',
      lastname: 'Nakamura',
      email: 'dolores.nakamura@example.test',
      phoneNumber: '555-0106',
      unit: 'Office',
      type: 2,
      avatarUrl: '',
      memberSince: '2020-11-20T00:00:00.000Z',
    },
  ];

  const roles: MockRole[] = Object.entries(ROLE_IDS).map(([name, roleId]) => ({ roleId, name }));

  const privileges: MockPrivilege[] = [
    ...privilegesFor('SystemAdministrator', allRights([1, 2, 3, 4])),
    ...privilegesFor('BoardMember', allRights([1, 2, 3])),
    ...privilegesFor('Staff', allRights([1, 2])),
    ...privilegesFor('Support', allRights([1, 2])),
    ...privilegesFor('Member', {
      User: [1],
      MaintenanceRequest: [1, 3],
      Notice: [1],
      ByLaw: [1],
      Report: [1],
      Member: [1],
    }),
  ];

  const documents: MockDocument[] = [
    {
      documentId: newId(),
      name: 'Spring Garden Workday',
      documentType: 'Notice',
      body: 'Join your neighbours in the courtyard garden on Saturday morning.',
      status: 'Published',
      createdOn: hoursAgo(72),
    },
    {
      documentId: newId(),
      name: 'Occupancy By-Law',
      documentType: 'ByLaw',
      body: 'Rules for guests, quiet hours, and shared spaces.',
      status: 'Published',
      createdOn: hoursAgo(96),
    },
    {
      documentId: newId(),
      name: 'Annual Financial Report',
      documentType: 'Report',
      body: 'Summary of the cooperative finances for the past year.',
      status: 'Draft',
      createdOn: hoursAgo(120),
    },
  ];

  const maintenanceRequests: MockMaintenanceRequest[] = [
    {
      maintenanceRequestId: newId(),
      ownerUserId: MEMBER_ID,
      title: 'Hallway light flickering',
      description: 'The light outside unit 204 flickers in the evening.',
      status: 'New',
      priority: 'Medium',
      category: 'Electrical',
      unitNumber: '204',
      phone: '555-0204',
      unattendedEntry: false,
      requestedByName: 'Margaret Okafor',
      requestedByProfileId: MEMBER_PROFILE_ID,
      date: hoursAgo(30),
    },
    {
      maintenanceRequestId: newId(),
      ownerUserId: MEMBER_ID,
      title: 'Radiator valve replaced',
      description: 'The bedroom radiator valve was leaking.',
      status: 'Completed',
      priority: 'High',
      category: 'Plumbing',
      unitNumber: '204',
      phone: '555-0204',
      unattendedEntry: true,
      requestedByName: 'Margaret Okafor',
      requestedByProfileId: MEMBER_PROFILE_ID,
      date: hoursAgo(200),
    },
    {
      maintenanceRequestId: newId(),
      ownerUserId: users[2].userId,
      title: 'Lobby door closer',
      description: 'The front door no longer closes on its own.',
      status: 'Received',
      priority: 'Medium',
      category: 'General',
      unitNumber: 'Lobby',
      phone: '555-0305',
      unattendedEntry: false,
      requestedByName: 'Rosalind Petrov',
      requestedByProfileId: profiles[3].profileId,
      date: hoursAgo(50),
    },
    {
      maintenanceRequestId: newId(),
      ownerUserId: users[2].userId,
      title: 'Garden tap repair',
      description: 'The courtyard tap drips constantly.',
      status: 'Started',
      priority: 'Low',
      category: 'Plumbing',
      unitNumber: 'Courtyard',
      phone: '555-0305',
      unattendedEntry: false,
      requestedByName: 'Rosalind Petrov',
      requestedByProfileId: profiles[3].profileId,
      date: hoursAgo(80),
    },
  ];

  const comments: MockComment[] = [
    {
      maintenanceRequestCommentId: newId(),
      maintenanceRequestId: maintenanceRequests[1].maintenanceRequestId,
      body: 'Replaced the valve and tested for leaks.',
      createdBy: 'staff',
      createdOn: hoursAgo(150),
    },
  ];

  const conversations: MockConversation[] = [
    {
      conversationId: newId(),
      subject: 'Welcome to the community',
      participantUserIds: [ADMIN_ID, MEMBER_ID],
      createdOn: hoursAgo(300),
    },
  ];

  const messages: MockMessage[] = [
    {
      messageId: newId(),
      conversationId: conversations[0].conversationId,
      senderUserId: ADMIN_ID,
      body: 'Welcome! Let us know if you need anything.',
      createdOn: hoursAgo(300),
    },
    {
      messageId: newId(),
      conversationId: conversations[0].conversationId,
      senderUserId: MEMBER_ID,
      body: 'Thank you, happy to be here.',
      createdOn: hoursAgo(299),
    },
  ];

  const invitations: MockInvitation[] = [
    {
      invitationTokenId: newId(),
      value: 'valid-invitation-token',
      type: 0,
      expirationDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      redeemed: false,
    },
  ];

  const assets: MockAsset[] = [
    {
      digitalAssetId: newId(),
      name: 'courtyard-plan.png',
      contentType: 'image/png',
      size: 2048,
      createdOn: hoursAgo(400),
    },
  ];

  const jsonContents: MockJsonContent[] = [
    {
      jsonContentId: newId(),
      name: 'SiteContent',
      content: createSiteContent(),
    },
    {
      jsonContentId: newId(),
      name: 'BoardOfDirectors',
      content: {
        members: [
          { name: 'Beatrice Hollis', title: 'President' },
          { name: 'Rosalind Petrov', title: 'Treasurer' },
          { name: 'Harriet Lindqvist', title: 'Secretary' },
        ],
      },
    },
  ];

  const pages: MockPage[] = [
    {
      pageId: newId(),
      title: 'How to apply',
      slug: 'how-to-apply',
      heroImageUrl: '/own/garden.svg',
      heroImageAlt: 'A woman in a sun hat waters planters of flowers and herbs on the rooftop.',
      body:
        '<p class="own-lead">Membership is open to women aged 55 and over. Applying takes one form and one visit.</p>' +
        '<h2>Who can apply</h2><ul><li>Women aged 55 or over.</li><li>A willingness to take part.</li></ul>' +
        '<h2>What happens next</h2><p>Send the form to the office, then come for a visit and a cup of tea.</p>',
      createdOn: hoursAgo(300),
    },
  ];

  const themes: MockTheme[] = [
    {
      themeId: newId(),
      cssCustomProperties:
        '--primary-color: #3D8A5A; --background-color: #F5F4F1; --accent-color: #3D8A5A; --text-color: #1A1918',
      isDefault: true,
    },
  ];

  return {
    users,
    profiles,
    roles,
    privileges,
    documents,
    noticeMessages: [],
    maintenanceRequests,
    comments,
    photos: [],
    conversations,
    messages,
    invitations,
    assets,
    jsonContents,
    pages,
    themes,
  };
}
