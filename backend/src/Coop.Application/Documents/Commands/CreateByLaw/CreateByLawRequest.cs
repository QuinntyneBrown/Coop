using MediatR;

namespace Coop.Application.Documents.Commands.CreateByLaw;

public class CreateByLawRequest : IRequest<CreateByLawResponse>
{
    public string Name { get; set; } = string.Empty;
    public Guid? DigitalAssetId { get; set; }
}
