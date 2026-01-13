// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Profile;
using Coop.SharedKernel.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Profile.Domain.Entities;
using Profile.Infrastructure.Data;

namespace Profile.Api.Features.Members;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MembersController : ControllerBase
{
    private readonly ProfileDbContext _context;
    private readonly IMessageBus _messageBus;

    public MembersController(ProfileDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    public async Task<ActionResult<List<MemberDto>>> GetAll()
    {
        var members = await _context.Members
            .Select(m => new MemberDto(
                m.ProfileId,
                m.UserId,
                m.FirstName,
                m.LastName,
                m.PhoneNumber,
                m.AvatarDigitalAssetId,
                m.Address != null ? new AddressDto(
                    m.Address.Street,
                    m.Address.Unit,
                    m.Address.City,
                    m.Address.Province,
                    m.Address.PostalCode
                ) : null
            ))
            .ToListAsync();

        return Ok(members);
    }

    [HttpGet("{memberId}")]
    public async Task<ActionResult<MemberDto>> GetById(Guid memberId)
    {
        var member = await _context.Members.FindAsync(memberId);

        if (member == null)
        {
            return NotFound();
        }

        return Ok(new MemberDto(
            member.ProfileId,
            member.UserId,
            member.FirstName,
            member.LastName,
            member.PhoneNumber,
            member.AvatarDigitalAssetId,
            member.Address != null ? new AddressDto(
                member.Address.Street,
                member.Address.Unit,
                member.Address.City,
                member.Address.Province,
                member.Address.PostalCode
            ) : null
        ));
    }

    [HttpPost]
    public async Task<ActionResult<MemberDto>> Create([FromBody] CreateMemberRequest request)
    {
        var member = new Member(request.UserId, request.FirstName, request.LastName);

        if (request.Address != null)
        {
            member.SetAddress(new Address
            {
                Street = request.Address.Street,
                Unit = request.Address.Unit,
                City = request.Address.City,
                Province = request.Address.Province,
                PostalCode = request.Address.PostalCode
            });
        }

        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ProfileCreatedEvent
        {
            ProfileId = member.ProfileId,
            UserId = member.UserId,
            ProfileType = "Member",
            FirstName = member.FirstName,
            LastName = member.LastName
        });

        return CreatedAtAction(nameof(GetById), new { memberId = member.ProfileId }, new MemberDto(
            member.ProfileId,
            member.UserId,
            member.FirstName,
            member.LastName,
            member.PhoneNumber,
            member.AvatarDigitalAssetId,
            member.Address != null ? new AddressDto(
                member.Address.Street,
                member.Address.Unit,
                member.Address.City,
                member.Address.Province,
                member.Address.PostalCode
            ) : null
        ));
    }

    [HttpPut("{memberId}")]
    public async Task<IActionResult> Update(Guid memberId, [FromBody] UpdateMemberRequest request)
    {
        var member = await _context.Members.FindAsync(memberId);

        if (member == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(request.FirstName) || !string.IsNullOrEmpty(request.LastName))
        {
            member.UpdateName(
                request.FirstName ?? member.FirstName,
                request.LastName ?? member.LastName
            );
        }

        if (request.Address != null)
        {
            member.SetAddress(new Address
            {
                Street = request.Address.Street,
                Unit = request.Address.Unit,
                City = request.Address.City,
                Province = request.Address.Province,
                PostalCode = request.Address.PostalCode
            });
        }

        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ProfileUpdatedEvent
        {
            ProfileId = member.ProfileId,
            UserId = member.UserId,
            FirstName = member.FirstName,
            LastName = member.LastName
        });

        return NoContent();
    }
}

public record MemberDto(
    Guid ProfileId,
    Guid UserId,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    Guid? AvatarDigitalAssetId,
    AddressDto? Address
);

public record AddressDto(string Street, string Unit, string City, string Province, string PostalCode);
public record CreateMemberRequest(Guid UserId, string FirstName, string LastName, AddressDto? Address);
public record UpdateMemberRequest(string? FirstName, string? LastName, AddressDto? Address);
