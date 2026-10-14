namespace Coop.Application.CMS.Dtos;

/// <summary>The home page hero.</summary>
public class HeroDto
{
    public string Eyebrow { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Lead { get; set; } = string.Empty;
    public string Badge { get; set; } = string.Empty;
    public LinkDto PrimaryAction { get; set; } = new();
    public LinkDto SecondaryAction { get; set; } = new();
    public PhotoDto Photo { get; set; } = new();
}
