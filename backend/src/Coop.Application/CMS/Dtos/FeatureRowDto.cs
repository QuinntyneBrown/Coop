namespace Coop.Application.CMS.Dtos;

/// <summary>A photograph beside a checklist.</summary>
public class FeatureRowDto
{
    public string Eyebrow { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public List<string> Items { get; set; } = new();
    public PhotoDto Photo { get; set; } = new();
}
