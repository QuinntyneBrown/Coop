using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.CMS.Pages.Commands.RemovePage;

[AuthorizeResourceOperation(AccessRight.Delete, Constants.Aggregates.Page)]
public class RemovePageRequest : IRequest<RemovePageResponse>
{
    public Guid PageId { get; set; }
}
