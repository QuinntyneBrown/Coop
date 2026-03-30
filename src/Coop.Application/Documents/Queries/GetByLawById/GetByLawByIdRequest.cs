using MediatR;

namespace Coop.Application.Documents.Queries.GetByLawById;

public class GetByLawByIdRequest : IRequest<GetByLawByIdResponse>
{
    public Guid DocumentId { get; set; }
}
