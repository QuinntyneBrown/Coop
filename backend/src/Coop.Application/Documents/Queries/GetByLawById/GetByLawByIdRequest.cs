using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetByLawById;

[OfficeOnly]
public class GetByLawByIdRequest : IRequest<GetByLawByIdResponse>
{
    public Guid DocumentId { get; set; }
}
