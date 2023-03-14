// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Coop.Application.Features;

public class GetDigitalAssetByIdRequest : IRequest<GetDigitalAssetByIdResponse>
{
    public System.Guid DigitalAssetId { get; set; }
}
public class GetDigitalAssetByIdResponse : ResponseBase
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class GetDigitalAssetByIdHandler : IRequestHandler<GetDigitalAssetByIdRequest, GetDigitalAssetByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetDigitalAssetByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetDigitalAssetByIdResponse> Handle(GetDigitalAssetByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            DigitalAsset = (await _context.DigitalAssets.SingleOrDefaultAsync(x => x.DigitalAssetId == request.DigitalAssetId)).ToDto()
        };
    }
}

