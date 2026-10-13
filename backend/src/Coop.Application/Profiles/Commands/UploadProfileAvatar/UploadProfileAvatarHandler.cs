using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using Coop.Domain.Assets;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.UploadProfileAvatar;

public class UploadProfileAvatarHandler : IRequestHandler<UploadProfileAvatarRequest, UploadProfileAvatarResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public UploadProfileAvatarHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<UploadProfileAvatarResponse> Handle(UploadProfileAvatarRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(p => p.ProfileId == request.ProfileId, cancellationToken);

        if (!await ProfileAccess.CanChangePictureAsync(_authorization, _user, profile))
            throw new UnauthorizedAccessException("Only the profile's owner and the office can change its picture.");

        using var stream = new MemoryStream();
        await request.File.CopyToAsync(stream, cancellationToken);
        var bytes = stream.ToArray();

        var current = profile.AvatarDigitalAssetId is Guid currentId
            ? await _context.DigitalAssets.SingleOrDefaultAsync(a => a.DigitalAssetId == currentId, cancellationToken)
            : null;

        // Re-posting the current picture returns the profile unchanged (ADR 0006).
        if (current is not null && current.Name == request.File.FileName && current.ContentType == request.File.ContentType
            && current.Bytes.AsSpan().SequenceEqual(bytes))
            return new UploadProfileAvatarResponse { Profile = ProfileDto.FromProfile(profile) };

        var digitalAsset = new DigitalAsset
        {
            Name = request.File.FileName,
            ContentType = request.File.ContentType,
            Bytes = bytes
        };
        _context.DigitalAssets.Add(digitalAsset);
        if (current is not null)
            _context.DigitalAssets.Remove(current);
        profile.SetAvatar(digitalAsset.DigitalAssetId);
        await _context.SaveChangesAsync(cancellationToken);

        return new UploadProfileAvatarResponse { Profile = ProfileDto.FromProfile(profile) };
    }
}
