namespace Coop.Application.CMS.Dtos;

/// <summary>A link on the public site: a label and a safe address (L2-REQ-098).</summary>
public class LinkDto : TranslatableDto
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
}
