// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Profile;
using Coop.SharedKernel.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Profile.Domain.Entities;
using Profile.Infrastructure.Data;

namespace Profile.Api.Features.StaffMembers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StaffMembersController : ControllerBase
{
    private readonly ProfileDbContext _context;
    private readonly IMessageBus _messageBus;

    public StaffMembersController(ProfileDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    public async Task<ActionResult<List<StaffMemberDto>>> GetAll()
    {
        var staffMembers = await _context.StaffMembers
            .Select(s => new StaffMemberDto(
                s.ProfileId,
                s.UserId,
                s.FirstName,
                s.LastName,
                s.JobTitle,
                s.PhoneNumber,
                s.AvatarDigitalAssetId
            ))
            .ToListAsync();

        return Ok(staffMembers);
    }

    [HttpGet("{staffMemberId}")]
    public async Task<ActionResult<StaffMemberDto>> GetById(Guid staffMemberId)
    {
        var staffMember = await _context.StaffMembers.FindAsync(staffMemberId);

        if (staffMember == null)
        {
            return NotFound();
        }

        return Ok(new StaffMemberDto(
            staffMember.ProfileId,
            staffMember.UserId,
            staffMember.FirstName,
            staffMember.LastName,
            staffMember.JobTitle,
            staffMember.PhoneNumber,
            staffMember.AvatarDigitalAssetId
        ));
    }

    [HttpPost]
    public async Task<ActionResult<StaffMemberDto>> Create([FromBody] CreateStaffMemberRequest request)
    {
        var staffMember = new StaffMember(request.UserId, request.JobTitle, request.FirstName, request.LastName);

        _context.StaffMembers.Add(staffMember);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ProfileCreatedEvent
        {
            ProfileId = staffMember.ProfileId,
            UserId = staffMember.UserId,
            ProfileType = "StaffMember",
            FirstName = staffMember.FirstName,
            LastName = staffMember.LastName
        });

        return CreatedAtAction(nameof(GetById), new { staffMemberId = staffMember.ProfileId }, new StaffMemberDto(
            staffMember.ProfileId,
            staffMember.UserId,
            staffMember.FirstName,
            staffMember.LastName,
            staffMember.JobTitle,
            staffMember.PhoneNumber,
            staffMember.AvatarDigitalAssetId
        ));
    }

    [HttpPut("{staffMemberId}")]
    public async Task<IActionResult> Update(Guid staffMemberId, [FromBody] UpdateStaffMemberRequest request)
    {
        var staffMember = await _context.StaffMembers.FindAsync(staffMemberId);

        if (staffMember == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(request.FirstName) || !string.IsNullOrEmpty(request.LastName))
        {
            staffMember.UpdateName(
                request.FirstName ?? staffMember.FirstName,
                request.LastName ?? staffMember.LastName
            );
        }

        if (!string.IsNullOrEmpty(request.JobTitle))
        {
            staffMember.SetJobTitle(request.JobTitle);
        }

        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ProfileUpdatedEvent
        {
            ProfileId = staffMember.ProfileId,
            UserId = staffMember.UserId,
            FirstName = staffMember.FirstName,
            LastName = staffMember.LastName
        });

        return NoContent();
    }
}

public record StaffMemberDto(
    Guid ProfileId,
    Guid UserId,
    string FirstName,
    string LastName,
    string JobTitle,
    string? PhoneNumber,
    Guid? AvatarDigitalAssetId
);

public record CreateStaffMemberRequest(Guid UserId, string FirstName, string LastName, string JobTitle);
public record UpdateStaffMemberRequest(string? FirstName, string? LastName, string? JobTitle);
