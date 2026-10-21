using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.UpdateByLaw;

[OfficeOnly]
public class UpdateByLawRequest : IRequest<UpdateByLawResponse>
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
