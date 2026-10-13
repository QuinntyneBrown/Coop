using MediatR;

namespace Coop.Application.CMS.Content.Commands.RemoveJsonContent;

public class RemoveJsonContentRequest : IRequest<RemoveJsonContentResponse>
{
    public Guid JsonContentId { get; set; }
}
