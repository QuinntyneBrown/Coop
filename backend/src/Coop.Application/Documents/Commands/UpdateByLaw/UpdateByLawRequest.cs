using MediatR;

namespace Coop.Application.Documents.Commands.UpdateByLaw;

public class UpdateByLawRequest : IRequest<UpdateByLawResponse>
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
