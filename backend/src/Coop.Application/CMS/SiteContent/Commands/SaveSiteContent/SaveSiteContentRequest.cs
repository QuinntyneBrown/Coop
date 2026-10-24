using Coop.Application.CMS.Dtos;
using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;

/// <summary>Replaces the whole site content draft (L2-REQ-099 AC2, L2-REQ-121 AC1).</summary>
[AuthorizeResourceOperation(AccessRight.Write, Constants.Aggregates.JsonContent)]
public class SaveSiteContentRequest : IRequest<SaveSiteContentResponse>
{
    public SiteContentDto SiteContent { get; set; } = new();
}
