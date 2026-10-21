using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Queries.GetByLaws;

[OfficeOnly]
public class GetByLawsRequest : IRequest<GetByLawsResponse>
{

}
