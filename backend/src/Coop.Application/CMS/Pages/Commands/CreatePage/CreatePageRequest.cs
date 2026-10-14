using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.CMS.Pages.Commands.CreatePage;

[AuthorizeResourceOperation(AccessRight.Create, Constants.Aggregates.Page)]
public class CreatePageRequest : IRequest<CreatePageResponse>
{
    public string Title { get; set; } = string.Empty;
    public string? HeroImageUrl { get; set; }
    public string? HeroImageAlt { get; set; }
    public string Body { get; set; } = string.Empty;
}
