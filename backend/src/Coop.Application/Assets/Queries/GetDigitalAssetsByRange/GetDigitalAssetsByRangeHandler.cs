using Coop.Application.Common.Interfaces;
using Coop.Application.Assets.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Queries.GetDigitalAssetsByRange;

public class GetDigitalAssetsByRangeHandler : IRequestHandler<GetDigitalAssetsByRangeRequest, GetDigitalAssetsByRangeResponse>
{
    private readonly ICoopDbContext _context;
    public GetDigitalAssetsByRangeHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDigitalAssetsByRangeResponse> Handle(GetDigitalAssetsByRangeRequest request, CancellationToken cancellationToken)
    {
        var das = await _context.DigitalAssets.Where(d => request.DigitalAssetIds.Contains(d.DigitalAssetId)).ToListAsync(cancellationToken);
        return new GetDigitalAssetsByRangeResponse { DigitalAssets = das.Select(DigitalAssetDto.FromDigitalAsset).ToList() };
    }
}
