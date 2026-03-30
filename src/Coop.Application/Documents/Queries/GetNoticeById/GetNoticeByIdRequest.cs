using MediatR;

namespace Coop.Application.Documents.Queries.GetNoticeById;

public class GetNoticeByIdRequest : IRequest<GetNoticeByIdResponse>
{
    public Guid DocumentId { get; set; }
}
