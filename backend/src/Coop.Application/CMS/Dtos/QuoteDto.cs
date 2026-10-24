namespace Coop.Application.CMS.Dtos;

/// <summary>The "A word from a member" block.</summary>
public class QuoteDto : HomeSectionDto
{
    public string Text { get; set; } = string.Empty;
    public string Attribution { get; set; } = string.Empty;
    public PhotoDto Photo { get; set; } = new();
}
