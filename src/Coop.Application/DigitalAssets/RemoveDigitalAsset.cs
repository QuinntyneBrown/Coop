// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class RemoveDigitalAssetRequest : IRequest<RemoveDigitalAssetResponse>
{
    public System.Guid DigitalAssetId { get; set; }
}
public class RemoveDigitalAssetResponse : ResponseBase
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class RemoveDigitalAssetHandler : IRequestHandler<RemoveDigitalAssetRequest, RemoveDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveDigitalAssetHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveDigitalAssetResponse> Handle(RemoveDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var digitalAsset = await _context.DigitalAssets.SingleAsync(x => x.DigitalAssetId == request.DigitalAssetId);
        _context.DigitalAssets.Remove(digitalAsset);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            DigitalAsset = digitalAsset.ToDto()
        };
    }
}

