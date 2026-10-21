using Coop.Application.Behaviors;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Coop.Application.Assets.Commands.CreateDigitalAsset;

[OfficeOnly]
public class CreateDigitalAssetRequest : IRequest<CreateDigitalAssetResponse>
{
    public IFormFile File { get; set; } = default!;
}
