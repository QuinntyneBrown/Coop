using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.IssuePreviewToken;

/// <summary>A token the public site presents to read the draft for the next hour (L2-REQ-125 AC1, ADR 0019).</summary>
[OfficeOnly]
public class IssuePreviewTokenRequest : IRequest<IssuePreviewTokenResponse> { }
