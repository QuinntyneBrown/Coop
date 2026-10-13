using MediatR;

namespace Coop.Application.CMS.Pages.Queries.GetPageBySlug;

public class GetPageBySlugRequest : IRequest<GetPageBySlugResponse>
{
    public string Slug { get; set; } = string.Empty;
}
