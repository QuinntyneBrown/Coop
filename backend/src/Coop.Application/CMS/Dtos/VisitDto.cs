namespace Coop.Application.CMS.Dtos;

/// <summary>The "Visit or apply" band.</summary>
public class VisitDto
{
    public string Eyebrow { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Lead { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Hours { get; set; } = string.Empty;
    public LinkDto Action { get; set; } = new();
}
