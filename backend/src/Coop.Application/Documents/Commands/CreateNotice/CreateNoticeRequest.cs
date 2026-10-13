using MediatR;

namespace Coop.Application.Documents.Commands.CreateNotice;

public class CreateNoticeRequest : IRequest<CreateNoticeResponse>
{
    public string Name { get; set; } = string.Empty;
    public string? Body { get; set; }
    public Guid? DigitalAssetId { get; set; }
}
