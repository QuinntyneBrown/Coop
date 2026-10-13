using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Queries.ServeDigitalAssetByName;

public class ServeDigitalAssetByNameHandler : IRequestHandler<ServeDigitalAssetByNameRequest, ServeDigitalAssetByNameResponse>
{
    private readonly ICoopDbContext _context;
    public ServeDigitalAssetByNameHandler(ICoopDbContext context) { _context = context; }

    public async Task<ServeDigitalAssetByNameResponse> Handle(ServeDigitalAssetByNameRequest request, CancellationToken cancellationToken)
    {
        var da = await _context.DigitalAssets.FirstAsync(d => d.Name == request.Name && !d.IsDeleted, cancellationToken);
        return new ServeDigitalAssetByNameResponse { Bytes = da.Bytes, ContentType = da.ContentType, Name = da.Name };
    }
}
