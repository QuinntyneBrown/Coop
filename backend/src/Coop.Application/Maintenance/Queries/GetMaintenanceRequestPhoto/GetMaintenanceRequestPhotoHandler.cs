using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestPhoto;

public class GetMaintenanceRequestPhotoHandler : IRequestHandler<GetMaintenanceRequestPhotoRequest, GetMaintenanceRequestPhotoResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetMaintenanceRequestPhotoHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetMaintenanceRequestPhotoResponse> Handle(GetMaintenanceRequestPhotoRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = await _context.MaintenanceRequests
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);

        if (!await MaintenanceRequestAccess.CanReadAsync(_context, _authorization, _user, maintenanceRequest, cancellationToken))
            throw new UnauthorizedAccessException("Only the household that made the request and the office can see its photos.");

        var asset = await (
            from link in _context.MaintenanceRequestDigitalAssets
            join digitalAsset in _context.DigitalAssets on link.DigitalAssetId equals digitalAsset.DigitalAssetId
            where link.MaintenanceRequestId == request.MaintenanceRequestId && link.DigitalAssetId == request.PhotoId && !link.IsDeleted
            select digitalAsset).SingleAsync(cancellationToken);

        return new GetMaintenanceRequestPhotoResponse { Bytes = asset.Bytes, ContentType = asset.ContentType, Name = asset.Name };
    }
}
