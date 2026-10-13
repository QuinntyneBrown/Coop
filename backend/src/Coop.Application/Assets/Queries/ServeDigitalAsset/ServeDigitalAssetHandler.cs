using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Queries.ServeDigitalAsset;

public class ServeDigitalAssetHandler : IRequestHandler<ServeDigitalAssetRequest, ServeDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public ServeDigitalAssetHandler(ICoopDbContext context) { _context = context; }

    public async Task<ServeDigitalAssetResponse> Handle(ServeDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var da = await _context.DigitalAssets.SingleAsync(d => d.DigitalAssetId == request.DigitalAssetId, cancellationToken);
        return new ServeDigitalAssetResponse { Bytes = da.Bytes, ContentType = da.ContentType, Name = da.Name };
    }
}
