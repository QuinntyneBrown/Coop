namespace Coop.Application.CMS.Dtos;

/// <summary>A photograph on the public site: its address, description and intrinsic size (L2-REQ-095).</summary>
public class PhotoDto
{
    public string Src { get; set; } = string.Empty;
    public string Alt { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
}
