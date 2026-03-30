# 08 - Digital Asset Management: Detailed Design

## 1. Overview

The Digital Asset Management feature provides centralized binary storage and retrieval for all file-based content in the Coop platform. A **DigitalAsset** stores raw bytes alongside metadata (name, MIME type, dimensions) and is referenced by other domain entities through foreign-key relationships:

- **Profile.AvatarDigitalAssetId** -- links a user profile to an avatar image.
- **MaintenanceRequestDigitalAsset** -- join entity attaching one or more assets to a maintenance request (photos, evidence).
- **Document.DigitalAssetId** -- associates a published document with its backing file (PDF, image).

The monolith implementation stores assets in the `DigitalAssets` DbSet via Entity Framework Core, with upload handled through multipart form parsing. The microservice variant (`Asset.Api`) adds computed `Size`, `CreatedAt` tracking, and publishes integration events (`DigitalAssetCreatedEvent`, `DigitalAssetDeletedEvent`) over the message bus.

### Key design goals

- Single source of truth for all binary content, avoiding duplication across aggregates.
- Multipart upload supporting multiple files per request (monolith) and single-file upload with validation (microservice).
- Anonymous serving endpoint (`/api/DigitalAsset/serve/{id}`) so images can be embedded directly in the UI.
- Batch retrieval by ID array to efficiently hydrate views that reference multiple assets.
- Image-specific metadata extraction (Height, Width) performed at upload time.
- Integration events enabling cross-service consistency in the microservices architecture.

---

## 2. Domain Model

### 2.1 DigitalAsset Entity (Monolith)

| Property | Type | Description |
|---|---|---|
| DigitalAssetId | `Guid` | Primary key. |
| Name | `string` | Original file name (ampersands normalized to "and"). |
| Bytes | `byte[]` | Raw binary content. |
| ContentType | `string` | MIME type (e.g., `image/png`, `application/pdf`). |
| Height | `float` | Image height in pixels (0 for non-image assets). |
| Width | `float` | Image width in pixels (0 for non-image assets). |

### 2.2 DigitalAsset Entity (Microservice)

Extends the monolith model with:

| Property | Type | Description |
|---|---|---|
| Size | `long` (computed) | `Bytes.Length` -- file size in bytes. |
| CreatedAt | `DateTime` | UTC timestamp of creation. |

### 2.3 MaintenanceRequestDigitalAsset (Join Entity)

| Property | Type | Description |
|---|---|---|
| MaintenanceRequestDigitalAssetId | `Guid` | Primary key. |
| MaintenanceRequestId | `Guid` | FK to the owning MaintenanceRequest. |
| DigitalAssetId | `Guid` | FK to the referenced DigitalAsset. |

Marked `[Owned]` -- lifecycle managed by the parent MaintenanceRequest aggregate.

### 2.4 Integration Events

| Event | Fields | Trigger |
|---|---|---|
| `DigitalAssetCreatedEvent` | DigitalAssetId, Name, ContentType | After upload and persistence. |
| `DigitalAssetDeletedEvent` | DigitalAssetId | After deletion. |

---

## 3. Class Diagram

![Class Diagram](class-diagram.png)

---

## 4. Sequence Diagrams

### 4.1 Upload Digital Asset

![Upload Asset Sequence](sequence-upload-asset.png)

### 4.2 Batch Retrieve Assets by IDs

![Batch Get Sequence](sequence-batch-get.png)

---

## 5. State Diagram -- Asset Lifecycle

![Asset Lifecycle](state-asset-lifecycle.png)

---

## 6. C4 Architecture Diagrams

### 6.1 Context

![C4 Context](c4-context.png)

### 6.2 Container

![C4 Container](c4-container.png)

### 6.3 Component

![C4 Component](c4-component.png)

---

## 7. API Surface

### DigitalAssetController -- Monolith (`/api/DigitalAsset`)

| Verb | Route | Handler | Description |
|---|---|---|---|
| POST | `/upload` | `UploadDigitalAssetHandler` | Multipart upload of one or more files. |
| GET | `/{digitalAssetId}` | `GetDigitalAssetByIdHandler` | Retrieve asset metadata and bytes by ID. |
| GET | `/range?digitalAssetIds=` | `GetDigitalAssetsByIdsHandler` | Batch retrieve assets by an array of IDs. |
| GET | `/page/{pageSize}/{index}` | `GetDigitalAssetsPageHandler` | Paginated asset listing. |
| GET | `/serve/{digitalAssetId}` | `GetDigitalAssetByIdHandler` | Anonymous -- returns raw file with content type. |
| DELETE | `/{digitalAssetId}` | `RemoveDigitalAssetHandler` | Delete an asset. |

### DigitalAssetsController -- Microservice (`/api/DigitalAssets`)

| Verb | Route | Description |
|---|---|---|
| POST | `/` | Upload a single file (IFormFile). Publishes `DigitalAssetCreatedEvent`. |
| POST | `/avatar` | Upload avatar image with type validation (jpeg, png, gif, webp). |
| GET | `/` | List all assets (metadata only, no bytes). |
| GET | `/{assetId}` | Get asset metadata by ID. |
| GET | `/serve/{assetId}` | Anonymous -- serve raw file bytes. |
| GET | `/by-name/{name}` | Anonymous -- serve file by name. |
| DELETE | `/{assetId}` | Delete asset. Publishes `DigitalAssetDeletedEvent`. |

---

## 8. Upload Flow

1. Client sends a multipart HTTP POST to `/api/DigitalAsset/upload`.
2. `UploadDigitalAssetHandler` parses multipart boundaries, extracting each file section.
3. For each file: bytes are read into memory, a `DigitalAsset` entity is created (or updated if the name already exists).
4. If the file is an image, `System.Drawing.Image.FromStream` extracts Height and Width.
5. All assets are persisted in a single `SaveChangesAsync` call.
6. The response returns the list of generated `DigitalAssetId` values.

---

## 9. Serving Flow

The `/serve/{digitalAssetId}` endpoint is marked `[AllowAnonymous]` so that asset URLs can be used directly in `<img>` tags and document downloads without requiring a bearer token. The handler returns a `FileContentResult` with the stored `ContentType`.

---

## 10. Cross-Entity References

| Entity | Property | Relationship |
|---|---|---|
| Profile | `AvatarDigitalAssetId` | Optional FK -- the profile's avatar image. |
| MaintenanceRequestDigitalAsset | `DigitalAssetId` | Required FK -- photo/evidence attached to a request. |
| Document | `DigitalAssetId` | Optional FK -- the document's backing file. |

---

## 11. Data Storage

Assets are persisted via Entity Framework Core through `ICoopDbContext.DigitalAssets`. In the microservice architecture, the `AssetDbContext` in `Asset.Infrastructure` owns the table. Binary content is stored directly in the database as a `varbinary(max)` column.

---

## 12. Key Source Files

| Layer | Path |
|---|---|
| Domain Entity (Monolith) | `src/Coop.Domain/Entities/DigitalAsset.cs` |
| Domain Entity (Microservice) | `src/Services/Asset/Asset.Domain/Entities/DigitalAsset.cs` |
| Join Entity | `src/Coop.Domain/Entities/MaintenanceRequest/MaintenanceRequestDigitalAsset.cs` |
| Integration Events | `src/Coop.SharedKernel/Events/Asset/DigitalAssetEvents.cs` |
| API Controller (Monolith) | `src/Coop.Api/Controllers/DigitalAssetController.cs` |
| API Controller (Microservice) | `src/Services/Asset/Asset.Api/Features/DigitalAssets/DigitalAssetsController.cs` |
| Upload Handler | `src/Coop.Application/DigitalAssets/UploadDigitalAsset.cs` |
| Batch Get Handler | `src/Coop.Application/DigitalAssets/GetDigitalAssetsByIds.cs` |
| DTO | `src/Coop.Application/DigitalAssets/DigitalAssetDto.cs` |
| Extensions | `src/Coop.Application/DigitalAssets/DigitalAssetExtensions.cs` |
