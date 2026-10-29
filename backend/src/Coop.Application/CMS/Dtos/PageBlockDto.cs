using System.Text.Json.Serialization;

namespace Coop.Application.CMS.Dtos;

/// <summary>
/// One block of a website page's body (L2-REQ-123): its <c>kind</c> picks the
/// derived type and the public page's element.
/// </summary>
[JsonPolymorphic(TypeDiscriminatorPropertyName = "kind")]
[JsonDerivedType(typeof(HeadingBlockDto), "heading")]
[JsonDerivedType(typeof(ParagraphBlockDto), "paragraph")]
[JsonDerivedType(typeof(BulletsBlockDto), "bullets")]
[JsonDerivedType(typeof(PhotoBlockDto), "photo")]
[JsonDerivedType(typeof(LinkBlockDto), "link")]
[JsonDerivedType(typeof(HtmlBlockDto), "html")]
public abstract class PageBlockDto : TranslatableDto
{
}
