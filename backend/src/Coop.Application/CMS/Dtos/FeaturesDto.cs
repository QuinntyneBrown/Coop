namespace Coop.Application.CMS.Dtos;

/// <summary>The "Our building" and "Our community" rows.</summary>
public class FeaturesDto : HomeSectionDto
{
    public List<FeatureRowDto> Rows { get; set; } = new();
}
