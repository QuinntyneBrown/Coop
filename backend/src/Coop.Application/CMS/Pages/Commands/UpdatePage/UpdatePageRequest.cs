using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.CMS.Pages.Commands.UpdatePage;

[AuthorizeResourceOperation(AccessRight.Write, Constants.Aggregates.Page)]
public class UpdatePageRequest : IRequest<UpdatePageResponse>
{
    public Guid PageId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? HeroImageUrl { get; set; }
    public string? HeroImageAlt { get; set; }
    /// <summary>The HTML of a page written before blocks existed; used only when <see cref="Sections"/> is empty (L2-REQ-123 AC4).</summary>
    public string? Body { get; set; }
    /// <summary>The body blocks in order.</summary>
    public List<Coop.Application.CMS.Dtos.PageBlockDto>? Sections { get; set; }
    /// <summary>True when visitors may see the page (L2-REQ-123 AC5, AC7).</summary>
    public bool Published { get; set; }
}
