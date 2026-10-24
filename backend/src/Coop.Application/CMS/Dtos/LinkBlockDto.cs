namespace Coop.Application.CMS.Dtos;

/// <summary>A link shown as a button in a page's body (L2-REQ-098).</summary>
public class LinkBlockDto : PageBlockDto
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
}
