using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetReportById;

[OfficeOnly]
public class GetReportByIdRequest : IRequest<GetReportByIdResponse>
{
    public Guid DocumentId { get; set; }
}
