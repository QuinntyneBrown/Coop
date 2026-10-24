namespace Coop.Application.CMS.Dtos;

/// <summary>The "At a glance" figures.</summary>
public class GlanceDto : HomeSectionDto
{
    public List<FigureDto> Figures { get; set; } = new();
}
