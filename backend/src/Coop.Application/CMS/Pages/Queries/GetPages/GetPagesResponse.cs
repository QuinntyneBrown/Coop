using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Pages.Queries.GetPages;

public class GetPagesResponse
{
    public List<PageDto> Pages { get; set; } = new();
}
