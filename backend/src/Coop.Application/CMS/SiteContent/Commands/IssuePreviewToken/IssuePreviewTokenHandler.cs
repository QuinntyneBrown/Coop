using Coop.Application.Common.Interfaces;
using MediatR;

namespace Coop.Application.CMS.SiteContent.Commands.IssuePreviewToken;

public class IssuePreviewTokenHandler : IRequestHandler<IssuePreviewTokenRequest, IssuePreviewTokenResponse>
{
    private readonly IPreviewTokenService _tokens;
    public IssuePreviewTokenHandler(IPreviewTokenService tokens) { _tokens = tokens; }

    public Task<IssuePreviewTokenResponse> Handle(IssuePreviewTokenRequest request, CancellationToken cancellationToken)
    {
        var expiresOn = DateTimeOffset.UtcNow.Add(SiteContentRules.PreviewTokenLifetime);
        return Task.FromResult(new IssuePreviewTokenResponse { Token = _tokens.Issue(expiresOn), ExpiresOn = expiresOn });
    }
}
