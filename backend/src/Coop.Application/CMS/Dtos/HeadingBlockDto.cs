namespace Coop.Application.CMS.Dtos;

/// <summary>A heading in a page's body, shown as an h2.</summary>
public class HeadingBlockDto : PageBlockDto
{
    public string Text { get; set; } = string.Empty;
}
