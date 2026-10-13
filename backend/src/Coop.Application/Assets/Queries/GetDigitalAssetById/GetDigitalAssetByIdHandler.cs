using Coop.Application.Common.Interfaces;
using Coop.Application.Assets.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Assets.Queries.GetDigitalAssetById;

public class GetDigitalAssetByIdHandler : IRequestHandler<GetDigitalAssetByIdRequest, GetDigitalAssetByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetDigitalAssetByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetDigitalAssetByIdResponse> Handle(GetDigitalAssetByIdRequest request, CancellationToken cancellationToken)
    {
        var da = await _context.DigitalAssets.SingleAsync(d => d.DigitalAssetId == request.DigitalAssetId, cancellationToken);
        return new GetDigitalAssetByIdResponse { DigitalAsset = DigitalAssetDto.FromDigitalAsset(da) };
    }
}
