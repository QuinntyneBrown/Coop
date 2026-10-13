using Coop.Application.Common.Interfaces;
using Coop.Application.Assets.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Queries.GetDigitalAssetsPage;

public class GetDigitalAssetsPageHandler : IRequestHandler<GetDigitalAssetsPageRequest, GetDigitalAssetsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetDigitalAssetsPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDigitalAssetsPageResponse> Handle(GetDigitalAssetsPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.DigitalAssets.Where(d => !d.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var das = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetDigitalAssetsPageResponse { DigitalAssets = das.Select(DigitalAssetDto.FromDigitalAsset).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
