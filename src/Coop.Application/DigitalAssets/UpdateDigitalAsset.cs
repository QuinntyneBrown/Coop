// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class UpdateDigitalAssetValidator : AbstractValidator<UpdateDigitalAssetRequest>
{
    public UpdateDigitalAssetValidator()
    {
        RuleFor(request => request.DigitalAsset).NotNull();
        RuleFor(request => request.DigitalAsset).SetValidator(new DigitalAssetValidator());
    }
}
public class UpdateDigitalAssetRequest : IRequest<UpdateDigitalAssetResponse>
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class UpdateDigitalAssetResponse : ResponseBase
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class UpdateDigitalAssetHandler : IRequestHandler<UpdateDigitalAssetRequest, UpdateDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateDigitalAssetHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateDigitalAssetResponse> Handle(UpdateDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var digitalAsset = await _context.DigitalAssets.SingleAsync(x => x.DigitalAssetId == request.DigitalAsset.DigitalAssetId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateDigitalAssetResponse()
        {
            DigitalAsset = digitalAsset.ToDto()
        };
    }
}

