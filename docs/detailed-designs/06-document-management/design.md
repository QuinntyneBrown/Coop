# 06 - Document Management: Detailed Design

## 1. Overview

The Document Management feature enables the Coop platform to create, publish, and manage organizational documents such as **Notices**, **By-Laws**, and **Reports**. Documents follow an event-sourced lifecycle and are persisted through Entity Framework Core. Each document type extends a common `Document` aggregate root, inheriting shared properties such as name, body, digital-asset reference, authorship, and publication state.

Within the modular monolith, the Document module serves both application surfaces: the **admin backend** manages drafting and publishing, while the **public web app** consumes published content and related attachments.

### Key Capabilities

- Create documents of type Notice, ByLaw, or Report with an associated digital asset.
- Publish documents by setting a `Published` timestamp.
- Delete draft or published documents.
- Query documents by ID, type, publication state, or page.
- Surface published content to the public web app while preserving privileged authoring workflows in the admin backend.

## 2. Architecture Diagrams

### 2.1 C4 Context Diagram

![C4 Context Diagram](c4-context.png)

### 2.2 C4 Container Diagram

![C4 Container Diagram](c4-container.png)

### 2.3 C4 Component Diagram

![C4 Component Diagram](c4-component.png)

## 3. Domain Model

### 3.1 Class Diagram

![Class Diagram](class-diagram.png)

### 3.2 Key Classes

| Class | Role |
|-------|------|
| `Document` | Aggregate root holding shared document state |
| `ByLaw` | Specialized document subtype |
| `Notice` | Specialized document subtype |
| `Report` | Specialized document subtype |
| `CreateDocument` | Domain event that initializes a document |
| `PublishDocument` | Domain event that sets `Published` |
| `DeleteDocument` | Domain event that removes the document |

## 4. Behavioural Design

### 4.1 Create Document Sequence

The create flow covers API receipt, validation, MediatR dispatch, domain-event application, and persistence in the shared database.

![Create Document Sequence](sequence-create-document.png)

### 4.2 Publish Document Sequence

Publishing applies the `PublishDocument` domain event and makes the document visible to public-facing queries.

![Publish Document Sequence](sequence-publish-document.png)

### 4.3 Document Lifecycle State Machine

Documents transition through **Draft**, **Published**, and **Deleted**.

![Document Lifecycle State Machine](state-document-lifecycle.png)

| Transition | Trigger | Effect |
|------------|---------|--------|
| `[*] -> Draft` | `CreateDocument` | Document is created and unpublished |
| `Draft -> Published` | `PublishDocument` | `Published` timestamp is set |
| `Draft -> Deleted` | `DeleteDocument` | Draft is removed |
| `Published -> Deleted` | `DeleteDocument` | Published document is removed |

## 5. API Surface

### 5.1 DocumentController (`/api/document`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/{documentId}` | Get document by ID |
| GET | `/` | Get all documents |
| GET | `/page/{pageSize}/{index}` | Paginated document listing |
| POST | `/` | Create a new document |
| PUT | `/` | Update a document |
| DELETE | `/{documentId}` | Remove a document |

### 5.2 NoticeController (`/api/notice`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/{noticeId}` | Get notice by ID |
| GET | `/` | Get all notices |
| GET | `/published` | Get published notices only |
| GET | `/page/{pageSize}/{index}` | Paginated notice listing |
| POST | `/` | Create a new notice |
| PUT | `/` | Update a notice |
| DELETE | `/{noticeId}` | Remove a notice |

### 5.3 ByLawController (`/api/bylaw`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/{byLawId}` | Get by-law by ID |
| GET | `/` | Get all by-laws |
| GET | `/published` | Get published by-laws only |
| GET | `/page/{pageSize}/{index}` | Paginated by-law listing |
| POST | `/` | Create a new by-law |
| PUT | `/` | Update a by-law |
| DELETE | `/{byLawId}` | Remove a by-law |

### 5.4 ReportController (`/api/report`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/{reportId}` | Get report by ID |
| GET | `/` | Get all reports |
| GET | `/published` | Get published reports only |
| GET | `/page/{pageSize}/{index}` | Paginated report listing |
| POST | `/` | Create a new report |
| PUT | `/` | Update a report |
| DELETE | `/{reportId}` | Remove a report |

## 6. Data Persistence

Documents are stored in the shared Coop database through module-owned tables. The Document module owns document persistence, while `DigitalAssetId` references assets managed by the Asset module through internal application contracts.

## 7. Cross-Cutting Concerns

- **Validation**: Each document type has a dedicated validator.
- **Authorization**: Admin authoring endpoints require JWT authentication and role-based privileges; public read endpoints may be anonymous when serving published content.
- **Digital Assets**: Documents reference a `DigitalAssetId` for files or images.
- **Event Sourcing**: Domain events are stored as audit records for replay and traceability.
