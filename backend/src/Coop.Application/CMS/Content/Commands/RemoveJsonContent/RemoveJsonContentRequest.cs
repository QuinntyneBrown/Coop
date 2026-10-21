using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.CMS.Content.Commands.RemoveJsonContent;

[OfficeOnly]
public class RemoveJsonContentRequest : IRequest<RemoveJsonContentResponse>
{
    public Guid JsonContentId { get; set; }
}
