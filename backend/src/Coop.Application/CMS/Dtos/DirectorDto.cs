namespace Coop.Application.CMS.Dtos;

/// <summary>One director on the Board of Directors list the home page shows (L2-REQ-086).</summary>
public class DirectorDto
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
}
