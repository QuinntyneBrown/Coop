using MediatR;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentByName;

public class GetJsonContentByNameRequest : IRequest<GetJsonContentByNameResponse>
{
    public string Name { get; set; } = string.Empty;
}
