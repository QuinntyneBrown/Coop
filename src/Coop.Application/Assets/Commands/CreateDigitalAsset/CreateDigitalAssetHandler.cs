using Coop.Application.Common.Interfaces;
using Coop.Application.Assets.Dtos;
using Coop.Domain.Assets;
using MediatR;

namespace Coop.Application.Assets.Commands.CreateDigitalAsset;

public class CreateDigitalAssetHandler : IRequestHandler<CreateDigitalAssetRequest, CreateDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public CreateDigitalAssetHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateDigitalAssetResponse> Handle(CreateDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        using var stream = new MemoryStream();
        await request.File.CopyToAsync(stream, cancellationToken);
        var bytes = stream.ToArray();

        var digitalAsset = new DigitalAsset
        {
            Name = request.File.FileName,
            ContentType = request.File.ContentType,
            Bytes = bytes
        };

        _context.DigitalAssets.Add(digitalAsset);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateDigitalAssetResponse { DigitalAsset = DigitalAssetDto.FromDigitalAsset(digitalAsset) };
    }
}
