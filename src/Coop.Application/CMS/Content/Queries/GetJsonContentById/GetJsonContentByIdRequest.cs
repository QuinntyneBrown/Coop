using MediatR;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentById;

public class GetJsonContentByIdRequest : IRequest<GetJsonContentByIdResponse>
{
    public Guid JsonContentId { get; set; }
}
