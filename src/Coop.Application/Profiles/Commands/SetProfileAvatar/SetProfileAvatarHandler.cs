using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.SetProfileAvatar;

public class SetProfileAvatarHandler : IRequestHandler<SetProfileAvatarRequest, SetProfileAvatarResponse>
{
    private readonly ICoopDbContext _context;

    public SetProfileAvatarHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<SetProfileAvatarResponse> Handle(SetProfileAvatarRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(p => p.ProfileId == request.ProfileId, cancellationToken);
        profile.SetAvatar(request.DigitalAssetId);
        await _context.SaveChangesAsync(cancellationToken);
        return new SetProfileAvatarResponse { Profile = ProfileDto.FromProfile(profile) };
    }
}
