// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Profile.Domain.Entities;
using Profile.Domain.Enums;
using Profile.Infrastructure.Data;

namespace Profile.Api.Features.InvitationTokens;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvitationTokensController : ControllerBase
{
    private readonly ProfileDbContext _context;

    public InvitationTokensController(ProfileDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<InvitationTokenDto>>> GetAll()
    {
        var tokens = await _context.InvitationTokens
            .Select(t => new InvitationTokenDto(
                t.InvitationTokenId,
                t.Value,
                t.Type.ToString(),
                t.ExpiryDate,
                t.IsUsed,
                t.CreatedAt
            ))
            .ToListAsync();

        return Ok(tokens);
    }

    [HttpGet("{tokenId}")]
    public async Task<ActionResult<InvitationTokenDto>> GetById(Guid tokenId)
    {
        var token = await _context.InvitationTokens.FindAsync(tokenId);

        if (token == null)
        {
            return NotFound();
        }

        return Ok(new InvitationTokenDto(
            token.InvitationTokenId,
            token.Value,
            token.Type.ToString(),
            token.ExpiryDate,
            token.IsUsed,
            token.CreatedAt
        ));
    }

    [AllowAnonymous]
    [HttpGet("validate/{value}")]
    public async Task<ActionResult<ValidateTokenResponse>> Validate(string value)
    {
        var token = await _context.InvitationTokens
            .SingleOrDefaultAsync(t => t.Value == value);

        if (token == null)
        {
            return Ok(new ValidateTokenResponse(false, null));
        }

        return Ok(new ValidateTokenResponse(token.IsValid(), token.Type.ToString()));
    }

    [HttpPost]
    public async Task<ActionResult<InvitationTokenDto>> Create([FromBody] CreateInvitationTokenRequest request)
    {
        if (!Enum.TryParse<InvitationTokenType>(request.Type, out var tokenType))
        {
            return BadRequest("Invalid token type");
        }

        var token = new InvitationToken(request.Value, tokenType, request.ExpiryDate);

        _context.InvitationTokens.Add(token);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { tokenId = token.InvitationTokenId }, new InvitationTokenDto(
            token.InvitationTokenId,
            token.Value,
            token.Type.ToString(),
            token.ExpiryDate,
            token.IsUsed,
            token.CreatedAt
        ));
    }

    [HttpPost("{tokenId}/use")]
    public async Task<IActionResult> UseToken(Guid tokenId)
    {
        var token = await _context.InvitationTokens.FindAsync(tokenId);

        if (token == null)
        {
            return NotFound();
        }

        if (!token.IsValid())
        {
            return BadRequest("Token is not valid");
        }

        token.MarkAsUsed();
        await _context.SaveChangesAsync();

        return Ok();
    }
}

public record InvitationTokenDto(
    Guid InvitationTokenId,
    string Value,
    string Type,
    DateTime? ExpiryDate,
    bool IsUsed,
    DateTime CreatedAt
);

public record CreateInvitationTokenRequest(string Value, string Type, DateTime? ExpiryDate);
public record ValidateTokenResponse(bool IsValid, string? Type);
