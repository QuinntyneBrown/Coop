namespace Coop.Application.CMS.Dtos;

/// <summary>A paragraph in a page's body.</summary>
public class ParagraphBlockDto : PageBlockDto
{
    public string Text { get; set; } = string.Empty;
}
