// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class CreateDigitalAssetValidator : AbstractValidator<CreateDigitalAssetRequest>
{
    public CreateDigitalAssetValidator()
    {
        RuleFor(request => request.DigitalAsset).NotNull();
        RuleFor(request => request.DigitalAsset).SetValidator(new DigitalAssetValidator());
    }
}
public class CreateDigitalAssetRequest : IRequest<CreateDigitalAssetResponse>
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class CreateDigitalAssetResponse : ResponseBase
{
    public DigitalAssetDto DigitalAsset { get; set; }
}
public class CreateDigitalAssetHandler : IRequestHandler<CreateDigitalAssetRequest, CreateDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public CreateDigitalAssetHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateDigitalAssetResponse> Handle(CreateDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var digitalAsset = new DigitalAsset();
        _context.DigitalAssets.Add(digitalAsset);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateDigitalAssetResponse()
        {
            DigitalAsset = digitalAsset.ToDto()
        };
    }
}

