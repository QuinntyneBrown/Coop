using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.UpdateNotice;

[OfficeOnly]
public class UpdateNoticeRequest : IRequest<UpdateNoticeResponse>
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Body { get; set; }
    public Guid? DigitalAssetId { get; set; }
}
