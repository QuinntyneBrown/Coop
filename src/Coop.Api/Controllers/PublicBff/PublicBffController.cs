using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Queries.GetPublishedByLaws;
using Coop.Application.Documents.Queries.GetPublishedNotices;
using Coop.Application.Documents.Queries.GetPublishedReports;
using Coop.Application.Identity.Commands.Authenticate;
using Coop.Application.Identity.Commands.CreateUser;
using Coop.Application.Maintenance.Commands.CreateMaintenanceRequest;
using Coop.Application.Maintenance.Commands.CreateMaintenanceRequestComment;
using Coop.Application.Maintenance.Queries.GetCurrentUserMaintenanceRequests;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestById;
using Coop.Application.Messaging.Commands.CreateConversation;
using Coop.Application.Messaging.Commands.SendMessage;
using Coop.Application.Messaging.Queries.GetConversationsByProfile;
using Coop.Application.Messaging.Queries.GetMessagesByConversation;
using Coop.Application.Onboarding.Commands.ValidateInvitationToken;
using Coop.Application.Profiles.Queries.GetBoardMembers;
using Coop.Application.Profiles.Queries.GetMembers;
using Coop.Application.Profiles.Queries.GetProfilesByUserId;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Controllers.PublicBff;

/// <summary>
/// Backend-for-frontend controller that provides endpoints matching
/// the public Angular app's expected API contract.
/// </summary>
[ApiController]
[Authorize]
public class PublicBffController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICoopDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public PublicBffController(IMediator mediator, ICoopDbContext context, IPasswordHasher passwordHasher)
    {
        _mediator = mediator;
        _context = context;
        _passwordHasher = passwordHasher;
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(Constants.ClaimTypes.UserId);
        return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
    }

    private async Task<Guid> GetCurrentProfileIdAsync()
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.Include(u => u.Profiles).SingleOrDefaultAsync(u => u.UserId == userId);
        return user?.CurrentProfileId ?? user?.Profiles.FirstOrDefault()?.ProfileId ?? Guid.Empty;
    }

    // ---- Auth / Registration ----

    [HttpPost("api/user/register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Validate the invitation token
        try
        {
            var validation = await _mediator.Send(new ValidateInvitationTokenRequest { Value = request.InvitationToken });
            if (!validation.Success)
                return BadRequest(new { message = "Invalid invitation token." });
        }
        catch
        {
            return BadRequest(new { message = "Invalid invitation token." });
        }

        // Create the user if not exists
        var existingUser = await _context.Users.AnyAsync(u => u.Username == request.Username);
        if (!existingUser)
        {
            await _mediator.Send(new CreateUserRequest
            {
                Username = request.Username,
                Password = request.Password,
                RoleIds = new List<Guid>()
            });
        }

        // Authenticate to get token
        AuthenticateResponse authResult;
        try
        {
            authResult = await _mediator.Send(new AuthenticateRequest
            {
                Username = request.Username,
                Password = request.Password
            });
        }
        catch
        {
            return BadRequest(new { message = "Registration failed." });
        }

        return Ok(new
        {
            token = authResult.AccessToken,
            accessToken = authResult.AccessToken,
            userId = authResult.UserId.ToString(),
            username = request.Username,
            roles = new[] { "Member" }
        });
    }

    // ---- User Profile ----

    [HttpGet("api/user/profile")]
    public async Task<IActionResult> GetUserProfile()
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users
            .Include(u => u.Profiles)
            .Include(u => u.Roles)
            .SingleOrDefaultAsync(u => u.UserId == userId);

        if (user == null) return NotFound();

        var profile = user.Profiles.FirstOrDefault();

        return Ok(new
        {
            id = profile?.ProfileId.ToString() ?? userId.ToString(),
            username = user.Username,
            firstName = profile?.Firstname ?? user.Username,
            lastName = profile?.Lastname ?? "",
            email = profile?.Email ?? "",
            phone = profile?.PhoneNumber ?? "",
            unit = (profile is Coop.Domain.Profiles.Member m) ? m.UnitNumber ?? "" : "",
            avatarUrl = "",
            memberSince = DateTime.UtcNow.AddYears(-1).ToString("o"),
            roles = user.Roles?.Select(r => r.Name).ToArray() ?? Array.Empty<string>()
        });
    }

    [HttpPut("api/user/profile")]
    public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.Include(u => u.Profiles).SingleOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return NotFound();

        var profile = user.Profiles.FirstOrDefault();
        if (profile != null)
        {
            if (!string.IsNullOrEmpty(request.FirstName)) profile.Firstname = request.FirstName;
            if (!string.IsNullOrEmpty(request.LastName)) profile.Lastname = request.LastName;
            if (!string.IsNullOrEmpty(request.Email)) profile.Email = request.Email;
            if (!string.IsNullOrEmpty(request.Phone)) profile.PhoneNumber = request.Phone;
            await _context.SaveChangesAsync(default);
        }

        return Ok(new
        {
            id = profile?.ProfileId.ToString() ?? userId.ToString(),
            username = user.Username,
            firstName = request.FirstName ?? profile?.Firstname ?? "",
            lastName = request.LastName ?? profile?.Lastname ?? "",
            email = request.Email ?? profile?.Email ?? "",
            phone = request.Phone ?? profile?.PhoneNumber ?? "",
        });
    }

    [HttpGet("api/user/profiles")]
    public async Task<IActionResult> GetUserProfiles()
    {
        var userId = GetCurrentUserId();
        var result = await _mediator.Send(new GetProfilesByUserIdRequest { UserId = userId });
        var profiles = result.Profiles.Select(p => new
        {
            id = p.ProfileId.ToString(),
            firstName = p.Firstname,
            lastName = p.Lastname,
            email = p.Email ?? "",
            phone = p.PhoneNumber ?? "",
        });
        return Ok(profiles);
    }

    [HttpPost("api/user/change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordBffRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.SingleOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return NotFound();

        var success = user.ChangePassword(_passwordHasher, request.CurrentPassword, request.NewPassword);
        if (!success)
            return BadRequest(new { message = "Current password is incorrect." });

        await _context.SaveChangesAsync(default);
        return Ok();
    }

    // ---- Maintenance Requests ----

    [HttpGet("api/maintenance-requests/my")]
    public async Task<IActionResult> GetMyMaintenanceRequests()
    {
        var result = await _mediator.Send(new GetCurrentUserMaintenanceRequestsRequest());
        var items = result.MaintenanceRequests.Select(mr => new
        {
            id = mr.MaintenanceRequestId.ToString(),
            title = mr.Title,
            description = mr.Description,
            status = mr.Status.ToString(),
            priority = "Medium",
            category = "General",
            createdAt = mr.Date.ToString("o"),
            updatedAt = mr.Date.ToString("o"),
            comments = mr.Comments.Select(c => new
            {
                id = c.MaintenanceRequestCommentId.ToString(),
                content = c.Body,
                createdAt = c.CreatedOn.ToString("o"),
                authorName = "Member"
            }),
            attachments = mr.DigitalAssets.Select(da => new
            {
                id = da.MaintenanceRequestDigitalAssetId.ToString(),
                fileName = "attachment",
                url = $"/api/digitalasset/{da.DigitalAssetId}"
            })
        });
        return Ok(items);
    }

    [HttpGet("api/maintenance-requests/{id}")]
    public async Task<IActionResult> GetMaintenanceRequest(Guid id)
    {
        var result = await _mediator.Send(new GetMaintenanceRequestByIdRequest { MaintenanceRequestId = id });
        var mr = result.MaintenanceRequest;
        return Ok(new
        {
            id = mr.MaintenanceRequestId.ToString(),
            title = mr.Title,
            description = mr.Description,
            status = mr.Status.ToString(),
            priority = "Medium",
            category = "General",
            createdAt = mr.Date.ToString("o"),
            updatedAt = mr.Date.ToString("o"),
            comments = mr.Comments.Select(c => new
            {
                id = c.MaintenanceRequestCommentId.ToString(),
                content = c.Body,
                createdAt = c.CreatedOn.ToString("o"),
                authorName = "Member"
            }),
            attachments = mr.DigitalAssets.Select(da => new
            {
                id = da.MaintenanceRequestDigitalAssetId.ToString(),
                fileName = "attachment",
                url = $"/api/digitalasset/{da.DigitalAssetId}"
            })
        });
    }

    [HttpPost("api/maintenance-requests")]
    public async Task<IActionResult> CreateMaintenanceRequest([FromBody] CreateMaintenanceRequestBffRequest request)
    {
        var profileId = await GetCurrentProfileIdAsync();
        var result = await _mediator.Send(new CreateMaintenanceRequestRequest
        {
            RequestedByProfileId = profileId,
            RequestedByName = "Member",
            Title = request.Title,
            Description = request.Description,
            Phone = "N/A",
        });

        var mr = result.MaintenanceRequest;
        return Ok(new
        {
            id = mr.MaintenanceRequestId.ToString(),
            maintenanceRequestId = mr.MaintenanceRequestId.ToString(),
            title = mr.Title,
            description = mr.Description,
            status = mr.Status.ToString(),
            priority = request.Priority ?? "Medium",
            category = request.Category ?? "General",
            createdAt = mr.Date.ToString("o"),
        });
    }

    [HttpDelete("api/maintenance-requests/{id}")]
    public async Task<IActionResult> DeleteMaintenanceRequest(Guid id)
    {
        await _mediator.Send(new Application.Maintenance.Commands.RemoveMaintenanceRequest.RemoveMaintenanceRequestRequest
        {
            MaintenanceRequestId = id
        });
        return Ok();
    }

    [HttpPost("api/maintenance-requests/{requestId}/comments")]
    public async Task<IActionResult> AddMaintenanceComment(Guid requestId, [FromBody] AddCommentBffRequest request)
    {
        var profileId = await GetCurrentProfileIdAsync();
        var result = await _mediator.Send(new CreateMaintenanceRequestCommentRequest
        {
            MaintenanceRequestId = requestId,
            CreatedByProfileId = profileId,
            Body = request.Content,
        });

        var c = result.MaintenanceRequestComment;
        return Ok(new
        {
            id = c.MaintenanceRequestCommentId.ToString(),
            content = c.Body,
            createdAt = c.CreatedOn.ToString("o"),
            authorName = "Member"
        });
    }

    // ---- Documents ----

    [HttpGet("api/documents")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDocuments()
    {
        var all = new List<object>();

        try
        {
            var n = await _mediator.Send(new GetPublishedNoticesRequest());
            all.AddRange(n.Notices.Select(d => (object)new
            {
                id = d.DocumentId.ToString(),
                title = d.Name,
                type = "notices",
                content = d.Body ?? "",
                published = true,
                createdAt = d.CreatedOn.ToString("o"),
            }));
        }
        catch { }

        try
        {
            var b = await _mediator.Send(new GetPublishedByLawsRequest());
            all.AddRange(b.ByLaws.Select(d => (object)new
            {
                id = d.DocumentId.ToString(),
                title = d.Name,
                type = "bylaws",
                content = "",
                published = true,
                createdAt = d.CreatedOn.ToString("o"),
            }));
        }
        catch { }

        try
        {
            var r = await _mediator.Send(new GetPublishedReportsRequest());
            all.AddRange(r.Reports.Select(d => (object)new
            {
                id = d.DocumentId.ToString(),
                title = d.Name,
                type = "reports",
                content = "",
                published = true,
                createdAt = d.CreatedOn.ToString("o"),
            }));
        }
        catch { }

        return Ok(all);
    }

    [HttpPost("api/documents")]
    public async Task<IActionResult> CreateDocument([FromBody] CreateDocumentBffRequest request)
    {
        Guid docId;
        try
        {
            if (request.Type == "bylaws")
            {
                var result = await _mediator.Send(new Application.Documents.Commands.CreateByLaw.CreateByLawRequest { Name = request.Title });
                docId = result.ByLaw.DocumentId;
                if (request.Published)
                    await _mediator.Send(new Application.Documents.Commands.PublishDocument.PublishDocumentRequest { DocumentId = docId });
            }
            else if (request.Type == "reports")
            {
                var result = await _mediator.Send(new Application.Documents.Commands.CreateReport.CreateReportRequest { Name = request.Title });
                docId = result.Report.DocumentId;
                if (request.Published)
                    await _mediator.Send(new Application.Documents.Commands.PublishDocument.PublishDocumentRequest { DocumentId = docId });
            }
            else
            {
                var result = await _mediator.Send(new Application.Documents.Commands.CreateNotice.CreateNoticeRequest { Name = request.Title, Body = request.Content });
                docId = result.Notice.DocumentId;
                if (request.Published)
                    await _mediator.Send(new Application.Documents.Commands.PublishDocument.PublishDocumentRequest { DocumentId = docId });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }

        return Ok(new
        {
            id = docId.ToString(),
            documentId = docId.ToString(),
            title = request.Title,
            type = request.Type,
            content = request.Content ?? "",
            published = request.Published,
            createdAt = DateTime.UtcNow.ToString("o"),
        });
    }

    [HttpDelete("api/documents/{id}")]
    public async Task<IActionResult> DeleteDocument(Guid id)
    {
        try { await _mediator.Send(new Application.Documents.Commands.RemoveNotice.RemoveNoticeRequest { DocumentId = id }); return Ok(); } catch { }
        try { await _mediator.Send(new Application.Documents.Commands.RemoveByLaw.RemoveByLawRequest { DocumentId = id }); return Ok(); } catch { }
        try { await _mediator.Send(new Application.Documents.Commands.RemoveReport.RemoveReportRequest { DocumentId = id }); return Ok(); } catch { }
        return NotFound();
    }

    // ---- Conversations / Messaging ----

    [HttpGet("api/conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var profileId = await GetCurrentProfileIdAsync();
        if (profileId == Guid.Empty) return Ok(Array.Empty<object>());

        var result = await _mediator.Send(new GetConversationsByProfileRequest { ProfileId = profileId });
        var conversations = result.Conversations.Select(c => new
        {
            id = c.ConversationId.ToString(),
            subject = c.Messages.FirstOrDefault()?.Body?.StartsWith("[Subject:") == true
                ? c.Messages.First().Body.Split(']')[0].Replace("[Subject:", "").Trim()
                : c.Messages.FirstOrDefault()?.Body ?? "Conversation",
            participantIds = c.ProfileIds.Select(p => p.ToString()),
            participantNames = c.ProfileIds.Select(_ => "Member"),
            lastMessage = StripSubjectPrefix(c.Messages.LastOrDefault()?.Body ?? ""),
            lastMessageAt = c.Messages.LastOrDefault()?.CreatedOn.ToString("o") ?? c.CreatedOn.ToString("o"),
            unreadCount = c.Messages.Count(m => !m.Read && m.FromProfileId != profileId),
        });
        return Ok(conversations);
    }

    [HttpPost("api/conversations")]
    public async Task<IActionResult> CreateConversation([FromBody] CreateConversationBffRequest request)
    {
        var profileId = await GetCurrentProfileIdAsync();
        var profileIds = new List<Guid> { profileId };
        foreach (var pid in request.ParticipantIds ?? new List<string>())
        {
            if (Guid.TryParse(pid, out var g) && g != profileId)
                profileIds.Add(g);
        }

        var result = await _mediator.Send(new CreateConversationRequest
        {
            ProfileIds = profileIds,
        });

        var conv = result.Conversation;

        // Send the initial message (embed subject if provided)
        var messageBody = request.InitialMessage ?? "";
        if (!string.IsNullOrEmpty(request.Subject))
        {
            messageBody = $"[Subject:{request.Subject}] {messageBody}";
        }
        if (!string.IsNullOrEmpty(messageBody))
        {
            await _mediator.Send(new SendMessageRequest
            {
                ConversationId = conv.ConversationId,
                FromProfileId = profileId,
                Body = messageBody,
            });
        }

        return Ok(new
        {
            id = conv.ConversationId.ToString(),
            conversationId = conv.ConversationId.ToString(),
            subject = request.Subject ?? "Conversation",
            participantIds = conv.ProfileIds.Select(p => p.ToString()),
            participantNames = conv.ProfileIds.Select(_ => "Member"),
            lastMessage = request.InitialMessage ?? "",
            lastMessageAt = DateTime.UtcNow.ToString("o"),
            unreadCount = 0,
        });
    }

    [HttpDelete("api/conversations/{id}")]
    public async Task<IActionResult> DeleteConversation(Guid id)
    {
        await _mediator.Send(new Application.Messaging.Commands.DeleteConversation.DeleteConversationRequest { ConversationId = id });
        return Ok();
    }

    [HttpGet("api/conversations/{conversationId}/messages")]
    public async Task<IActionResult> GetMessages(Guid conversationId)
    {
        var result = await _mediator.Send(new GetMessagesByConversationRequest { ConversationId = conversationId });
        var messages = result.Messages.Select(m =>
        {
            var body = m.Body;
            // Strip subject prefix if present
            if (body.StartsWith("[Subject:") && body.Contains(']'))
            {
                body = body.Substring(body.IndexOf(']') + 1).TrimStart();
            }
            return new
            {
                id = m.MessageId.ToString(),
                conversationId = m.ConversationId.ToString(),
                senderId = m.FromProfileId.ToString(),
                senderName = "Member",
                content = body,
                createdAt = m.CreatedOn.ToString("o"),
            };
        });
        return Ok(messages);
    }

    [HttpPost("api/conversations/{conversationId}/messages")]
    public async Task<IActionResult> SendMessageToConversation(Guid conversationId, [FromBody] SendMessageBffRequest request)
    {
        var profileId = await GetCurrentProfileIdAsync();
        var result = await _mediator.Send(new SendMessageRequest
        {
            ConversationId = conversationId,
            FromProfileId = profileId,
            Body = request.Content,
        });

        var m = result.Message;
        return Ok(new
        {
            id = m.MessageId.ToString(),
            conversationId = m.ConversationId.ToString(),
            senderId = m.FromProfileId.ToString(),
            senderName = "Member",
            content = m.Body,
            createdAt = m.CreatedOn.ToString("o"),
        });
    }

    private static string StripSubjectPrefix(string body)
    {
        if (body.StartsWith("[Subject:") && body.Contains(']'))
            return body.Substring(body.IndexOf(']') + 1).TrimStart();
        return body;
    }

    // ---- Board Members (public) ----

    [HttpGet("api/board-members")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBoardMembersPublic()
    {
        var result = await _mediator.Send(new GetBoardMembersRequest());
        var members = result.BoardMembers.Select(bm => new
        {
            name = bm.Fullname,
            role = "Board Member",
        });
        return Ok(members);
    }

    // ---- JSON Content ----

    [HttpGet("api/json-content")]
    [AllowAnonymous]
    public async Task<IActionResult> GetJsonContents()
    {
        var result = await _mediator.Send(new Application.CMS.Content.Queries.GetJsonContents.GetJsonContentsRequest());
        return Ok(result.JsonContents);
    }

    [HttpGet("api/json-content/{name}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetJsonContentByName(string name)
    {
        var result = await _mediator.Send(new Application.CMS.Content.Queries.GetJsonContentByName.GetJsonContentByNameRequest { Name = name });
        if (result.JsonContent == null)
            return Ok(new { id = (string?)null, name = name, content = (object?)null });

        object? parsedContent = null;
        try
        {
            parsedContent = System.Text.Json.JsonSerializer.Deserialize<object>(result.JsonContent.Json);
        }
        catch
        {
            parsedContent = result.JsonContent.Json;
        }

        return Ok(new
        {
            id = result.JsonContent.JsonContentId.ToString(),
            name = result.JsonContent.Name,
            content = parsedContent,
        });
    }

    // ---- Members ----

    [HttpGet("api/user/members")]
    public async Task<IActionResult> GetMembersForUser()
    {
        var result = await _mediator.Send(new GetMembersRequest());
        return Ok(result.Members.Select(m => new
        {
            id = m.ProfileId.ToString(),
            name = m.Fullname,
        }));
    }
}

// ---- Request DTOs ----

public class RegisterRequest
{
    public string InvitationToken { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UpdateProfileRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

public class ChangePasswordBffRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class CreateMaintenanceRequestBffRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public string? Category { get; set; }
}

public class AddCommentBffRequest
{
    public string Content { get; set; } = string.Empty;
}

public class CreateDocumentBffRequest
{
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "notices";
    public string? Content { get; set; }
    public bool Published { get; set; } = true;
}

public class CreateConversationBffRequest
{
    public string? Subject { get; set; }
    public List<string>? ParticipantIds { get; set; }
    public string? InitialMessage { get; set; }
}

public class SendMessageBffRequest
{
    public string Content { get; set; } = string.Empty;
}
