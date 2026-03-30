using Coop.Application.Common.Interfaces;
using Coop.Application.Assets.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Queries.GetDigitalAssets;

public class GetDigitalAssetsHandler : IRequestHandler<GetDigitalAssetsRequest, GetDigitalAssetsResponse>
{
    private readonly ICoopDbContext _context;
    public GetDigitalAssetsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDigitalAssetsResponse> Handle(GetDigitalAssetsRequest request, CancellationToken cancellationToken)
    {
        var das = await _context.DigitalAssets.Where(d => !d.IsDeleted).ToListAsync(cancellationToken);
        return new GetDigitalAssetsResponse { DigitalAssets = das.Select(DigitalAssetDto.FromDigitalAsset).ToList() };
    }
}
