using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.RemoveProfileAvatar;

public class RemoveProfileAvatarHandler : IRequestHandler<RemoveProfileAvatarRequest, RemoveProfileAvatarResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public RemoveProfileAvatarHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<RemoveProfileAvatarResponse> Handle(RemoveProfileAvatarRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(p => p.ProfileId == request.ProfileId, cancellationToken);

        if (!await ProfileAccess.CanChangePictureAsync(_authorization, _user, profile))
            throw new UnauthorizedAccessException("Only the profile's owner and the office can change its picture.");

        // Removing a picture that is already gone returns the profile unchanged (ADR 0006).
        if (profile.AvatarDigitalAssetId is Guid currentId)
        {
            var current = await _context.DigitalAssets.SingleOrDefaultAsync(a => a.DigitalAssetId == currentId, cancellationToken);
            if (current is not null)
                _context.DigitalAssets.Remove(current);
            profile.ClearAvatar();
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new RemoveProfileAvatarResponse { Profile = ProfileDto.FromProfile(profile) };
    }
}
