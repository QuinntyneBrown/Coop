namespace Coop.Application.CMS.Dtos;

/// <summary>The home page blocks, in page order (L2-REQ-096).</summary>
public class HomeContentDto
{
    public HeroDto Hero { get; set; } = new();
    public GlanceDto Glance { get; set; } = new();
    public AboutDto About { get; set; } = new();
    public GalleryDto Gallery { get; set; } = new();
    public FeaturesDto Features { get; set; } = new();
    public NoticesDto Notices { get; set; } = new();
    public SectionHeadDto Board { get; set; } = new();
    public QuoteDto Quote { get; set; } = new();
    public VisitDto Visit { get; set; } = new();
}
