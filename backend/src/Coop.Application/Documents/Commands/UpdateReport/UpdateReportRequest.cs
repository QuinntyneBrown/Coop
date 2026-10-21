using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.UpdateReport;

[OfficeOnly]
public class UpdateReportRequest : IRequest<UpdateReportResponse>
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Body { get; set; }
    public Guid? DigitalAssetId { get; set; }
}
