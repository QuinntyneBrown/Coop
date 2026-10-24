namespace Coop.Application.CMS.Dtos;

/// <summary>The home page sections in the order visitors see them (L2-REQ-096, L2-REQ-122).</summary>
public class HomeContentDto
{
    public List<HomeSectionDto> Sections { get; set; } = new();
}
