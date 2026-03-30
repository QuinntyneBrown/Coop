using MediatR;

namespace Coop.Application.Documents.Queries.GetReportById;

public class GetReportByIdRequest : IRequest<GetReportByIdResponse>
{
    public Guid DocumentId { get; set; }
}
