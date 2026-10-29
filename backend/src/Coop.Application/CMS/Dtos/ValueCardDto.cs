namespace Coop.Application.CMS.Dtos;

/// <summary>One "Who we are" value card; <c>Icon</c> is members, affordable or company.</summary>
public class ValueCardDto : TranslatableDto
{
    public string Icon { get; set; } = "members";
    public string Title { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}
