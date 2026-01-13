// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Profile;
using Coop.SharedKernel.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Profile.Domain.Entities;
using Profile.Infrastructure.Data;

namespace Profile.Api.Features.BoardMembers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BoardMembersController : ControllerBase
{
    private readonly ProfileDbContext _context;
    private readonly IMessageBus _messageBus;

    public BoardMembersController(ProfileDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    public async Task<ActionResult<List<BoardMemberDto>>> GetAll()
    {
        var boardMembers = await _context.BoardMembers
            .Select(b => new BoardMemberDto(
                b.ProfileId,
                b.UserId,
                b.FirstName,
                b.LastName,
                b.BoardTitle,
                b.PhoneNumber,
                b.AvatarDigitalAssetId
            ))
            .ToListAsync();

        return Ok(boardMembers);
    }

    [HttpGet("{boardMemberId}")]
    public async Task<ActionResult<BoardMemberDto>> GetById(Guid boardMemberId)
    {
        var boardMember = await _context.BoardMembers.FindAsync(boardMemberId);

        if (boardMember == null)
        {
            return NotFound();
        }

        return Ok(new BoardMemberDto(
            boardMember.ProfileId,
            boardMember.UserId,
            boardMember.FirstName,
            boardMember.LastName,
            boardMember.BoardTitle,
            boardMember.PhoneNumber,
            boardMember.AvatarDigitalAssetId
        ));
    }

    [HttpPost]
    public async Task<ActionResult<BoardMemberDto>> Create([FromBody] CreateBoardMemberRequest request)
    {
        var boardMember = new BoardMember(request.UserId, request.BoardTitle, request.FirstName, request.LastName);

        _context.BoardMembers.Add(boardMember);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ProfileCreatedEvent
        {
            ProfileId = boardMember.ProfileId,
            UserId = boardMember.UserId,
            ProfileType = "BoardMember",
            FirstName = boardMember.FirstName,
            LastName = boardMember.LastName
        });

        return CreatedAtAction(nameof(GetById), new { boardMemberId = boardMember.ProfileId }, new BoardMemberDto(
            boardMember.ProfileId,
            boardMember.UserId,
            boardMember.FirstName,
            boardMember.LastName,
            boardMember.BoardTitle,
            boardMember.PhoneNumber,
            boardMember.AvatarDigitalAssetId
        ));
    }

    [HttpPut("{boardMemberId}")]
    public async Task<IActionResult> Update(Guid boardMemberId, [FromBody] UpdateBoardMemberRequest request)
    {
        var boardMember = await _context.BoardMembers.FindAsync(boardMemberId);

        if (boardMember == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(request.FirstName) || !string.IsNullOrEmpty(request.LastName))
        {
            boardMember.UpdateName(
                request.FirstName ?? boardMember.FirstName,
                request.LastName ?? boardMember.LastName
            );
        }

        if (!string.IsNullOrEmpty(request.BoardTitle))
        {
            boardMember.SetBoardTitle(request.BoardTitle);
        }

        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ProfileUpdatedEvent
        {
            ProfileId = boardMember.ProfileId,
            UserId = boardMember.UserId,
            FirstName = boardMember.FirstName,
            LastName = boardMember.LastName
        });

        return NoContent();
    }
}

public record BoardMemberDto(
    Guid ProfileId,
    Guid UserId,
    string FirstName,
    string LastName,
    string BoardTitle,
    string? PhoneNumber,
    Guid? AvatarDigitalAssetId
);

public record CreateBoardMemberRequest(Guid UserId, string FirstName, string LastName, string BoardTitle);
public record UpdateBoardMemberRequest(string? FirstName, string? LastName, string? BoardTitle);
