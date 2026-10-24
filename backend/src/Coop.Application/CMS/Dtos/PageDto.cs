using Coop.Application.CMS.Pages;
using Coop.Domain.CMS;

namespace Coop.Application.CMS.Dtos;

public class PageDto
{
    public Guid PageId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? HeroImageUrl { get; set; }
    public string? HeroImageAlt { get; set; }
    /// <summary>The body blocks in order (L2-REQ-123).</summary>
    public List<PageBlockDto> Sections { get; set; } = new();
    /// <summary>True when visitors can see the page.</summary>
    public bool Published { get; set; }
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
            Sections = PageSections.Parse(page),
            Published = page.Published,
            CreatedOn = page.CreatedOn
        };
    }
}
