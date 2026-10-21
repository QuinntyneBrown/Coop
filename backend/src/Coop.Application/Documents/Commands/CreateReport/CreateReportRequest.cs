using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.CreateReport;

[OfficeOnly]
public class CreateReportRequest : IRequest<CreateReportResponse>
{
    public string Name { get; set; } = string.Empty;
    public string? Body { get; set; }
    public Guid? DigitalAssetId { get; set; }
}
