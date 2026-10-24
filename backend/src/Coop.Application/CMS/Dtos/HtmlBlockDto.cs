namespace Coop.Application.CMS.Dtos;

/// <summary>The HTML of a page written before blocks existed, kept as one block (L2-REQ-123 AC4, AC9).</summary>
public class HtmlBlockDto : PageBlockDto
{
    public string Html { get; set; } = string.Empty;
}
