using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.SetProfileAvatar;

public class SetProfileAvatarHandler : IRequestHandler<SetProfileAvatarRequest, SetProfileAvatarResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public SetProfileAvatarHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<SetProfileAvatarResponse> Handle(SetProfileAvatarRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(p => p.ProfileId == request.ProfileId, cancellationToken);

        if (!await ProfileAccess.CanChangePictureAsync(_authorization, _user, profile))
            throw new UnauthorizedAccessException("Only the profile's owner and the office can change its picture.");

        profile.SetAvatar(request.DigitalAssetId);
        await _context.SaveChangesAsync(cancellationToken);
        return new SetProfileAvatarResponse { Profile = ProfileDto.FromProfile(profile) };
    }
}
