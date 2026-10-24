namespace Coop.Application.CMS.Dtos;

/// <summary>The "A look around" gallery.</summary>
public class GalleryDto : HomeSectionDto
{
    public string Eyebrow { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public List<GalleryPhotoDto> Photos { get; set; } = new();
}
