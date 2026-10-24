namespace Coop.Application.CMS.SiteContent.Commands.IssuePreviewToken;

public class IssuePreviewTokenResponse
{
    public string Token { get; set; } = string.Empty;

    public DateTimeOffset ExpiresOn { get; set; }
}
