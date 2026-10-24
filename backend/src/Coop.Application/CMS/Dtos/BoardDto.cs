namespace Coop.Application.CMS.Dtos;

/// <summary>The head of the "Meet the board" section; the directors come from the board list (L2-REQ-124).</summary>
public class BoardDto : HomeSectionDto
{
    public string Eyebrow { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
}
