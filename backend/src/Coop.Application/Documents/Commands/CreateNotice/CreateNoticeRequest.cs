using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.CreateNotice;

[OfficeOnly]
public class CreateNoticeRequest : IRequest<CreateNoticeResponse>
{
    public string Name { get; set; } = string.Empty;
    public string? Body { get; set; }
    public Guid? DigitalAssetId { get; set; }
}
