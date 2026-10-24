using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Queries.GetSiteContentDraft;

/// <summary>The content the office edits: the draft when one exists, else the published copy (L2-REQ-121 AC3).</summary>
[OfficeOnly]
public class GetSiteContentDraftRequest : IRequest<GetSiteContentDraftResponse> { }
