namespace Coop.Application.CMS.Dtos;

/// <summary>The "Who we are" block.</summary>
public class AboutDto : HomeSectionDto
{
    public string Eyebrow { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Lead { get; set; } = string.Empty;
    public List<ValueCardDto> Values { get; set; } = new();
}
