// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class UpdateProfileAvatarRequest : IRequest<UpdateProfileAvatarResponse>
{
    public Guid ProfileId { get; set; }
    public Guid DigitalAssetId { get; set; }
}
public class UpdateProfileAvatarResponse : ResponseBase { }
public class UpdateProfileAvatarHandler : IRequestHandler<UpdateProfileAvatarRequest, UpdateProfileAvatarResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateProfileAvatarHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateProfileAvatarResponse> Handle(UpdateProfileAvatarRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == request.ProfileId);
        profile.SetAvatar(request.DigitalAssetId);
        await _context.SaveChangesAsync(cancellationToken);
        return new();
    }
}

