using Coop.Application.Behaviors;
using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.PublishSiteContent;

/// <summary>Copies the draft to the published copy and removes the draft; harmless when there is no draft (L2-REQ-121 AC4, ADR 0018).</summary>
[OfficeOnly]
[AuthorizeResourceOperation(AccessRight.Write, Constants.Aggregates.JsonContent)]
public class PublishSiteContentRequest : IRequest<PublishSiteContentResponse> { }
