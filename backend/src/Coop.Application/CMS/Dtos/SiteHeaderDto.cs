namespace Coop.Application.CMS.Dtos;

/// <summary>The site header on every public page (L2-REQ-095).</summary>
public class SiteHeaderDto : TranslatableDto
{
    public string SiteName { get; set; } = string.Empty;
    public string SiteSubtitle { get; set; } = string.Empty;
    public List<LinkDto> MenuLinks { get; set; } = new();
    public LinkDto SignInLink { get; set; } = new();
    public LinkDto VisitLink { get; set; } = new();
}
