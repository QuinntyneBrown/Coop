// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.SharedKernel.Events.Profile;
using Coop.SharedKernel.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Profile.Infrastructure.Data;

namespace Profile.Api.Features.Profiles;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly ProfileDbContext _context;
    private readonly IMessageBus _messageBus;

    public ProfilesController(ProfileDbContext context, IMessageBus messageBus)
    {
        _context = context;
        _messageBus = messageBus;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProfileDto>>> GetAll()
    {
        var profiles = await _context.Profiles
            .Select(p => new ProfileDto(
                p.ProfileId,
                p.UserId,
                p.Type.ToString(),
                p.FirstName,
                p.LastName,
                p.PhoneNumber,
                p.AvatarDigitalAssetId
            ))
            .ToListAsync();

        return Ok(profiles);
    }

    [HttpGet("{profileId}")]
    public async Task<ActionResult<ProfileDto>> GetById(Guid profileId)
    {
        var profile = await _context.Profiles.FindAsync(profileId);

        if (profile == null)
        {
            return NotFound();
        }

        return Ok(new ProfileDto(
            profile.ProfileId,
            profile.UserId,
            profile.Type.ToString(),
            profile.FirstName,
            profile.LastName,
            profile.PhoneNumber,
            profile.AvatarDigitalAssetId
        ));
    }

    [HttpGet("by-user/{userId}")]
    public async Task<ActionResult<List<ProfileDto>>> GetByUserId(Guid userId)
    {
        var profiles = await _context.Profiles
            .Where(p => p.UserId == userId)
            .Select(p => new ProfileDto(
                p.ProfileId,
                p.UserId,
                p.Type.ToString(),
                p.FirstName,
                p.LastName,
                p.PhoneNumber,
                p.AvatarDigitalAssetId
            ))
            .ToListAsync();

        return Ok(profiles);
    }

    [HttpPut("{profileId}/avatar")]
    public async Task<IActionResult> SetAvatar(Guid profileId, [FromBody] SetAvatarRequest request)
    {
        var profile = await _context.Profiles.FindAsync(profileId);

        if (profile == null)
        {
            return NotFound();
        }

        profile.SetAvatar(request.DigitalAssetId);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{profileId}")]
    public async Task<IActionResult> Delete(Guid profileId)
    {
        var profile = await _context.Profiles.FindAsync(profileId);

        if (profile == null)
        {
            return NotFound();
        }

        _context.Profiles.Remove(profile);
        await _context.SaveChangesAsync();

        await _messageBus.PublishAsync(new ProfileDeletedEvent
        {
            ProfileId = profileId,
            UserId = profile.UserId
        });

        return NoContent();
    }
}

public record ProfileDto(
    Guid ProfileId,
    Guid UserId,
    string Type,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    Guid? AvatarDigitalAssetId
);

public record SetAvatarRequest(Guid DigitalAssetId);
