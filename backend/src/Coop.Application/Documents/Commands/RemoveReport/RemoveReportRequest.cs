using MediatR;

namespace Coop.Application.Documents.Commands.RemoveReport;

public class RemoveReportRequest : IRequest<RemoveReportResponse>
{
    public Guid DocumentId { get; set; }
}
