namespace Coop.Application.CMS.Dtos;

/// <summary>The site footer on every public page (L2-REQ-095).</summary>
public class SiteFooterDto : TranslatableDto
{
    public string ContactHeading { get; set; } = string.Empty;
    public string Organisation { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SiteLinksHeading { get; set; } = string.Empty;
    public List<LinkDto> SiteLinks { get; set; } = new();
    public string MemberLinksHeading { get; set; } = string.Empty;
    public List<LinkDto> MemberLinks { get; set; } = new();
    public string Copyright { get; set; } = string.Empty;
    public string WebsiteLine { get; set; } = string.Empty;
}
