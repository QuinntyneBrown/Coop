using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.RemoveReport;

[OfficeOnly]
public class RemoveReportRequest : IRequest<RemoveReportResponse>
{
    public Guid DocumentId { get; set; }
}
