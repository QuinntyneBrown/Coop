using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.CreateByLaw;

[OfficeOnly]
public class CreateByLawRequest : IRequest<CreateByLawResponse>
{
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
