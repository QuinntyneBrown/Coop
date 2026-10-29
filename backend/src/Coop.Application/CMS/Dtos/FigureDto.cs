namespace Coop.Application.CMS.Dtos;

/// <summary>One "At a glance" figure.</summary>
public class FigureDto : TranslatableDto
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}
