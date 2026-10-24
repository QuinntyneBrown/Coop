using System.Text.Json.Serialization;

namespace Coop.Application.CMS.Dtos;

/// <summary>
/// One section of the home page in <c>home.sections</c> (L2-REQ-122, ADR 0021):
/// its <c>kind</c> picks the derived type and the public page's template, and
/// <c>hidden</c> keeps a section out of the page while its values are kept.
/// </summary>
[JsonPolymorphic(TypeDiscriminatorPropertyName = "kind")]
[JsonDerivedType(typeof(HeroDto), "hero")]
[JsonDerivedType(typeof(GlanceDto), "glance")]
[JsonDerivedType(typeof(AboutDto), "about")]
[JsonDerivedType(typeof(GalleryDto), "gallery")]
[JsonDerivedType(typeof(FeaturesDto), "features")]
[JsonDerivedType(typeof(NoticesDto), "notices")]
[JsonDerivedType(typeof(BoardDto), "board")]
[JsonDerivedType(typeof(QuoteDto), "quote")]
[JsonDerivedType(typeof(VisitDto), "visit")]
public abstract class HomeSectionDto
{
    public bool Hidden { get; set; }
}
