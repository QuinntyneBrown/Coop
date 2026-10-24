using Coop.Application.Behaviors;
using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.DiscardSiteContentDraft;

/// <summary>Removes the draft so the office edits the published copy again; harmless when there is no draft (L2-REQ-121 AC5).</summary>
[OfficeOnly]
[AuthorizeResourceOperation(AccessRight.Write, Constants.Aggregates.JsonContent)]
public class DiscardSiteContentDraftRequest : IRequest<DiscardSiteContentDraftResponse> { }
