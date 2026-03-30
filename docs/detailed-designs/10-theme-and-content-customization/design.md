# 10 - Theme and Content Customization: Detailed Design

## 1. Overview

The Theme and Content Customization feature enables the Coop platform to support dynamic visual theming and CMS-style content management without redeployment. It is composed of two independent but complementary sub-features:

- **Theme** -- stores CSS custom properties (design tokens) as JSON, allowing per-profile or platform-wide visual customization. A Theme with a `null` ProfileId acts as the default (global) theme; a Theme linked to a specific ProfileId provides per-user overrides.
- **JsonContent** -- stores named, structured JSON documents that drive front-end content sections (landing page hero, board-of-directors listing, etc.). Content is identified by a well-known name (e.g., `Hero`, `BoardOfDirectors`, `Landing`) so the SPA can fetch it without coupling to database identifiers.

Both entities follow the standard CQRS / Mediator pattern used throughout the monolith and are also exposed through dedicated microservices (Asset Service for themes, Document Service for JSON content) in the distributed architecture.

### Key design goals

- Allow administrators to change visual branding (colours, fonts, spacing) at runtime through CSS custom properties stored as JSON.
- Support a default (global) theme and optional per-profile theme overrides.
- Provide a lightweight, schema-free content store for front-end sections identified by well-known names.
- Maintain consistency with the Coop platform's existing CQRS, MediatR, and Entity Framework patterns.
- Publish domain events (e.g., `ThemeUpdatedEvent`) so that other services can react to customization changes.

---

## 2. Domain Model

### 2.1 Theme Entity (Monolith)

| Property | Type | Description |
|---|---|---|
| ThemeId | `Guid` | Primary key (database-generated). |
| ProfileId | `Guid?` | Optional FK to owning profile. `null` = default theme. |
| CssCustomProperties | `JObject` | JSON object containing CSS custom property key-value pairs. |

Methods: `SetCssCustomProperties(JObject)`.

### 2.2 Theme Entity (Microservice -- Asset Service)

Extends the monolith model with audit timestamps:

| Property | Type | Description |
|---|---|---|
| CreatedAt | `DateTime` | UTC timestamp set on creation. |
| UpdatedAt | `DateTime?` | UTC timestamp set on each update. |

Methods: `UpdateCssCustomProperties(JObject)` -- sets properties and stamps `UpdatedAt`.

### 2.3 JsonContent Entity (Monolith)

| Property | Type | Description |
|---|---|---|
| JsonContentId | `Guid` | Primary key. |
| Name | `string` | Well-known content name (e.g., `Hero`). |
| Json | `JObject` | Arbitrary JSON payload consumed by the front end. |

Methods: `SetJson(JObject)`.

### 2.4 JsonContent Entity (Microservice -- Document Service)

Extends the monolith model with audit timestamps:

| Property | Type | Description |
|---|---|---|
| CreatedAt | `DateTime` | UTC timestamp set on creation. |
| UpdatedAt | `DateTime?` | UTC timestamp set on each update. |

Methods: `UpdateJson(JObject)`, `SetName(string)`.

### 2.5 Constants -- JsonContentName

Well-known content names used as lookup keys:

| Constant | Value |
|---|---|
| `Hero` | `"Hero"` |
| `BoardOfDirectors` | `"BoardOfDirectors"` |
| `Landing` | `"Landing"` |

---

## 3. Class Diagram

![Class Diagram](class-diagram.png)

---

## 4. Sequence Diagrams

### 4.1 Create / Update Theme

![Create Theme Sequence](sequence-create-theme.png)

### 4.2 Create / Retrieve JSON Content by Name

![JSON Content Sequence](sequence-json-content.png)

---

## 5. State Diagram -- Theme Lifecycle

![Theme Lifecycle](state-theme-lifecycle.png)

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

### ThemeController (`/api/Theme`) -- Monolith

| Verb | Route | Handler | Description |
|---|---|---|---|
| GET | `/{themeId}` | `GetThemeByIdHandler` | Retrieve a single theme by ID. |
| GET | `/default` | `GetDefaultThemeHandler` | Retrieve the global default theme (ProfileId = null). |
| GET | `/profile/{profileId}` | `GetThemeByProfileIdHandler` | Retrieve the theme for a specific profile. |
| GET | `/` | `GetThemesHandler` | List all themes. |
| GET | `/page/{pageSize}/{index}` | `GetThemesPageHandler` | Paginated theme listing. |
| POST | `/` | `CreateThemeHandler` | Create a new theme. |
| PUT | `/` | `UpdateThemeHandler` | Update an existing theme's CSS properties. |
| DELETE | `/{themeId}` | `RemoveThemeHandler` | Delete a theme. |

### ThemesController (`/api/Themes`) -- Asset Microservice

| Verb | Route | Description |
|---|---|---|
| GET | `/` | List all themes. |
| GET | `/default` | Get the default (ProfileId = null) theme. |
| GET | `/{themeId}` | Get theme by ID. |
| GET | `/by-profile/{profileId}` | Get theme by profile. |
| POST | `/` | Create theme (validates no duplicate per profile). |
| PUT | `/{themeId}` | Update theme; publishes `ThemeUpdatedEvent`. |
| DELETE | `/{themeId}` | Delete theme (cannot delete default). |

### JsonContentController (`/api/JsonContent`) -- Monolith

| Verb | Route | Handler | Description |
|---|---|---|---|
| GET | `/{jsonContentId}` | `GetJsonContentByIdHandler` | Retrieve content by ID. |
| GET | `/name/{name}` | `GetJsonContentByNameHandler` | Retrieve content by well-known name. |
| GET | `/` | `GetJsonContentsHandler` | List all JSON content entries. |
| GET | `/page/{pageSize}/{index}` | `GetJsonContentsPageHandler` | Paginated content listing. |
| POST | `/` | `CreateJsonContentHandler` | Create a new content entry (raises `CreatedJsonContent` domain event). |
| PUT | `/` | `UpdateJsonContentHandler` | Update an existing content entry. |
| DELETE | `/{jsonContentId}` | `RemoveJsonContentHandler` | Delete a content entry. |

### JsonContentsController (`/api/JsonContents`) -- Document Microservice

| Verb | Route | Description |
|---|---|---|
| GET | `/` | List all content entries. |
| GET | `/{contentId}` | Get content by ID. |
| GET | `/by-name/{name}` | Get content by well-known name. |
| POST | `/` | Create content (validates unique name). |
| PUT | `/{contentId}` | Update content JSON. |
| DELETE | `/{contentId}` | Delete content entry. |

---

## 8. Domain Events

| Event | Trigger | Payload |
|---|---|---|
| `CreatedJsonContent` | New JsonContent saved | `JsonContentId`, `Name` |
| `ThemeUpdatedEvent` | Theme CSS properties updated (microservice) | `ThemeId`, `ProfileId` |

---

## 9. Data Storage

- **Monolith**: Themes and JsonContents are persisted via Entity Framework Core through `ICoopDbContext.Themes` and `ICoopDbContext.JsonContents`. `CssCustomProperties` and `Json` columns are stored as `nvarchar(max)` with JSON serialization handled by Newtonsoft `JObject`.
- **Microservice**: The Asset Service uses `AssetDbContext.Themes`; the Document Service uses `DocumentDbContext.JsonContents`. Each maintains its own database.

---

## 10. Validation

- **ThemeValidator** -- ensures `CssCustomProperties` is not null/empty.
- **JsonContentValidator** -- ensures `Name` and `Json` are not null/empty.
- **Duplicate prevention** (microservice): the Asset Service rejects a second theme for the same ProfileId; the Document Service rejects duplicate content names.

---

## 11. Key Source Files

| Layer | Path |
|---|---|
| Domain Entity | `src/Coop.Domain/Entities/Theme.cs` |
| Domain Entity | `src/Coop.Domain/Entities/JsonContent/JsonContent.cs` |
| Domain Event | `src/Coop.Domain/DomainEvents/JsonContent/CreatedJsonContent.cs` |
| API Controller | `src/Coop.Api/Controllers/ThemeController.cs` |
| API Controller | `src/Coop.Api/Controllers/JsonContentController.cs` |
| Application Handlers | `src/Coop.Application/Themes/*.cs` |
| Application Handlers | `src/Coop.Application/JsonContents/**/*.cs` |
| Microservice Entity | `src/Services/Asset/Asset.Domain/Entities/Theme.cs` |
| Microservice Entity | `src/Services/Document/Document.Domain/Entities/JsonContent.cs` |
| Microservice Controller | `src/Services/Asset/Asset.Api/Features/Themes/ThemesController.cs` |
| Microservice Controller | `src/Services/Document/Document.Api/Features/JsonContents/JsonContentsController.cs` |
| EF Configuration | `src/Coop.Infrastructure/Data/EntityConfigurations/ThemeConfiguration.cs` |
| EF Configuration | `src/Coop.Infrastructure/Data/EntityConfigurations/JsonContentConfiguration.cs` |
| Front-end Model | `src/Coop.App/src/app/@api/models/theme.ts` |
| Front-end Service | `src/Coop.App/src/app/@api/services/theme.service.ts` |
| Front-end Store | `src/Coop.App/src/app/@core/stores/theme.store.ts` |
