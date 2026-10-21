using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.RemoveByLaw;

[OfficeOnly]
public class RemoveByLawRequest : IRequest<RemoveByLawResponse>
{
    public Guid DocumentId { get; set; }
}
