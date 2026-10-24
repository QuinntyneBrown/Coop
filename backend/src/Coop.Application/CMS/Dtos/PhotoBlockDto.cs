namespace Coop.Application.CMS.Dtos;

/// <summary>A photo in a page's body, with its description and size (L2-REQ-097).</summary>
public class PhotoBlockDto : PageBlockDto
{
    public PhotoDto Photo { get; set; } = new();
}
