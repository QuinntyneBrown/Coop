namespace Coop.Application.CMS.Dtos;

/// <summary>One gallery photograph; <c>Size</c> is wide, tall or small.</summary>
public class GalleryPhotoDto
{
    public PhotoDto Photo { get; set; } = new();
    public string Caption { get; set; } = string.Empty;
    public string Size { get; set; } = "small";
}
