using MediatR;

namespace Coop.Application.Documents.Commands.RemoveByLaw;

public class RemoveByLawRequest : IRequest<RemoveByLawResponse>
{
    public Guid DocumentId { get; set; }
}
