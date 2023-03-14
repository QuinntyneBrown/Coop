// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class DigitalAssetGetByNameRequest : IRequest<DigitalAssetGetByNameResponse>
{
    public string Filename { get; set; }
}
public class DigitalAssetGetByNameResponse : ResponseBase
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class DigitalAssetGetByNameHandler : IRequestHandler<DigitalAssetGetByNameRequest, DigitalAssetGetByNameResponse>
{
    private readonly ICoopDbContext _context;
    public DigitalAssetGetByNameHandler(ICoopDbContext context)
        => _context = context;
    public async Task<DigitalAssetGetByNameResponse> Handle(DigitalAssetGetByNameRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            DigitalAsset = (await _context.DigitalAssets
            .SingleOrDefaultAsync(x => x.Name == request.Filename))
            .ToDto()
        };
    }
}

