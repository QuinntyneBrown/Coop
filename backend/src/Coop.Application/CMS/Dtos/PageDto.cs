using Coop.Domain.CMS;

namespace Coop.Application.CMS.Dtos;

public class PageDto
{
    public Guid PageId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? HeroImageUrl { get; set; }
    public string? HeroImageAlt { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }

    public static PageDto FromPage(Page page)
    {
        return new PageDto
        {
            PageId = page.PageId,
            Title = page.Title,
            Slug = page.Slug,
            HeroImageUrl = page.HeroImageUrl,
            HeroImageAlt = page.HeroImageAlt,
            Body = page.Body,
            CreatedOn = page.CreatedOn
        };
    }
}
