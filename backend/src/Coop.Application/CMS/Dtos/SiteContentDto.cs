namespace Coop.Application.CMS.Dtos;

/// <summary>The header, footer and home page content of the public site, stored as the <c>SiteContent</c> JSON content entry (L2-REQ-097).</summary>
public class SiteContentDto
{
    public SiteHeaderDto Header { get; set; } = new();
    public SiteFooterDto Footer { get; set; } = new();
    public HomeContentDto Home { get; set; } = new();
}
