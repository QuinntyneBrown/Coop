using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Queries.GetPublishedByLaws;
using Coop.Application.Documents.Queries.GetPublishedNotices;
using Coop.Application.Documents.Queries.GetPublishedReports;
using Coop.Application.Identity.Commands.RegisterMember;
using Coop.Application.Messaging.Commands.CreateConversation;
using Coop.Application.Messaging.Commands.SendMessage;
using Coop.Application.Profiles.Dtos;
using Coop.Application.Profiles.Queries.GetBoardMembers;
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

    public PublicBffController(IMediator mediator, ICoopDbContext context)
    {
        _mediator = mediator;
        _context = context;
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
        var result = await _mediator.Send(new RegisterMemberRequest
        {
            InvitationToken = request.InvitationToken,
            Username = request.Username,
            Password = request.Password
        });
        if (result.Error is not null)
            return BadRequest(new { message = result.Error });

        return Ok(new
        {
            token = result.AccessToken,
            accessToken = result.AccessToken,
            userId = result.UserId.ToString(),
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
            avatarUrl = ProfileDto.AvatarUrlFor(profile?.AvatarDigitalAssetId) ?? "",
            noticeByEmail = profile?.NoticeByEmail ?? false,
            noticeByText = profile?.NoticeByText ?? false,
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
            if (request.NoticeByEmail.HasValue) profile.NoticeByEmail = request.NoticeByEmail.Value;
            if (request.NoticeByText.HasValue) profile.NoticeByText = request.NoticeByText.Value;
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
            noticeByEmail = profile?.NoticeByEmail ?? false,
            noticeByText = profile?.NoticeByText ?? false,
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

    // ---- Conversations / Messaging ----

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
        var avatarUrls = await SenderAvatarUrlsAsync(new[] { m.FromProfileId });
        return Ok(new
        {
            id = m.MessageId.ToString(),
            conversationId = m.ConversationId.ToString(),
            senderId = m.FromProfileId.ToString(),
            senderName = "Member",
            senderAvatarUrl = avatarUrls.GetValueOrDefault(m.FromProfileId, ""),
            content = m.Body,
            createdAt = m.CreatedOn.ToString("o"),
        });
    }

    // The picture shown beside each sender's messages, keyed by profile.
    private async Task<Dictionary<Guid, string>> SenderAvatarUrlsAsync(IEnumerable<Guid> profileIds)
    {
        var ids = profileIds.Distinct().ToList();
        var avatars = await _context.Profiles
            .Where(p => ids.Contains(p.ProfileId) && p.AvatarDigitalAssetId != null)
            .Select(p => new { p.ProfileId, p.AvatarDigitalAssetId })
            .ToListAsync();
        return avatars.ToDictionary(p => p.ProfileId, p => ProfileDto.AvatarUrlFor(p.AvatarDigitalAssetId)!);
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
    public bool? NoticeByEmail { get; set; }
    public bool? NoticeByText { get; set; }
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
