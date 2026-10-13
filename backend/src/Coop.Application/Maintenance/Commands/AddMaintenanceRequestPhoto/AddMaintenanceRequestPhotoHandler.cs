using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.Domain.Assets;
using Coop.Domain.Maintenance;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.AddMaintenanceRequestPhoto;

public class AddMaintenanceRequestPhotoHandler : IRequestHandler<AddMaintenanceRequestPhotoRequest, AddMaintenanceRequestPhotoResponse>
{
    private readonly ICoopDbContext _context;
    private readonly ClaimsPrincipal _user;

    public AddMaintenanceRequestPhotoHandler(ICoopDbContext context, ClaimsPrincipal user)
    {
        _context = context;
        _user = user;
    }

    public async Task<AddMaintenanceRequestPhotoResponse> Handle(AddMaintenanceRequestPhotoRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = await _context.MaintenanceRequests
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);

        if (!await MaintenanceRequestAccess.IsHouseholdAsync(_context, _user, maintenanceRequest, cancellationToken))
            throw new UnauthorizedAccessException("Only the household that made the request can add photos to it.");

        using var stream = new MemoryStream();
        await request.File.CopyToAsync(stream, cancellationToken);
        var bytes = stream.ToArray();

        // Re-posting the same photo returns the one already attached (ADR 0005).
        var existing = await (
            from link in _context.MaintenanceRequestDigitalAssets
            join asset in _context.DigitalAssets on link.DigitalAssetId equals asset.DigitalAssetId
            where link.MaintenanceRequestId == request.MaintenanceRequestId && !link.IsDeleted
                && asset.Name == request.File.FileName && asset.ContentType == request.File.ContentType
            select asset).ToListAsync(cancellationToken);
        var duplicate = existing.FirstOrDefault(asset => asset.Bytes.AsSpan().SequenceEqual(bytes));
        if (duplicate is not null)
            return new AddMaintenanceRequestPhotoResponse { Photo = MaintenanceRequestPhotoDto.From(request.MaintenanceRequestId, duplicate) };

        var digitalAsset = new DigitalAsset
        {
            Name = request.File.FileName,
            ContentType = request.File.ContentType,
            Bytes = bytes
        };
        _context.DigitalAssets.Add(digitalAsset);
        _context.MaintenanceRequestDigitalAssets.Add(new MaintenanceRequestDigitalAsset
        {
            MaintenanceRequestId = request.MaintenanceRequestId,
            DigitalAssetId = digitalAsset.DigitalAssetId
        });
        await _context.SaveChangesAsync(cancellationToken);

        return new AddMaintenanceRequestPhotoResponse { Photo = MaintenanceRequestPhotoDto.From(request.MaintenanceRequestId, digitalAsset) };
    }
}
