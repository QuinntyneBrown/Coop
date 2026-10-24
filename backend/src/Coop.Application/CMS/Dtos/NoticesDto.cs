namespace Coop.Application.CMS.Dtos;

/// <summary>The head of the "What's on" block and its message when no notice is published.</summary>
public class NoticesDto : HomeSectionDto
{
    public string Eyebrow { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Lead { get; set; } = string.Empty;
    public string EmptyMessage { get; set; } = string.Empty;
}
