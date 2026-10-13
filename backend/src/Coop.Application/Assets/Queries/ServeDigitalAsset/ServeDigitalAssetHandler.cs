using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Queries.ServeDigitalAsset;

public class ServeDigitalAssetHandler : IRequestHandler<ServeDigitalAssetRequest, ServeDigitalAssetResponse?>
{
    private readonly ICoopDbContext _context;
    public ServeDigitalAssetHandler(ICoopDbContext context) { _context = context; }

    public async Task<ServeDigitalAssetResponse?> Handle(ServeDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        // Maintenance request photos are private to the household and the office;
        // they are served only through api/maintenance-requests/{id}/photos.
        if (await _context.MaintenanceRequestDigitalAssets.AnyAsync(l => l.DigitalAssetId == request.DigitalAssetId, cancellationToken))
            throw new UnauthorizedAccessException("This photo belongs to a maintenance request.");

        // A removed asset, such as a replaced profile picture, is no longer served.
        var da = await _context.DigitalAssets.SingleOrDefaultAsync(d => d.DigitalAssetId == request.DigitalAssetId, cancellationToken);
        if (da is null)
            return null;
        return new ServeDigitalAssetResponse { Bytes = da.Bytes, ContentType = da.ContentType, Name = da.Name };
    }
}
