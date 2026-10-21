using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentById;

[OfficeOnly]
public class GetJsonContentByIdRequest : IRequest<GetJsonContentByIdResponse>
{
    public Guid JsonContentId { get; set; }
}
