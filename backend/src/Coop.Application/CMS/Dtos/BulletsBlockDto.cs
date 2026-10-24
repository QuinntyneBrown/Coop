namespace Coop.Application.CMS.Dtos;

/// <summary>A bullet list in a page's body, one item per line in the editor.</summary>
public class BulletsBlockDto : PageBlockDto
{
    public List<string> Items { get; set; } = new();
}
