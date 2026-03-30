using Coop.Application.Common.Interfaces;
using Coop.Application.Assets.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Commands.RemoveDigitalAsset;

public class RemoveDigitalAssetHandler : IRequestHandler<RemoveDigitalAssetRequest, RemoveDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveDigitalAssetHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveDigitalAssetResponse> Handle(RemoveDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var da = await _context.DigitalAssets.SingleAsync(d => d.DigitalAssetId == request.DigitalAssetId, cancellationToken);
        da.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveDigitalAssetResponse { DigitalAsset = DigitalAssetDto.FromDigitalAsset(da) };
    }
}
