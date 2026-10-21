using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetNoticeById;

[OfficeOnly]
public class GetNoticeByIdRequest : IRequest<GetNoticeByIdResponse>
{
    public Guid DocumentId { get; set; }
}
