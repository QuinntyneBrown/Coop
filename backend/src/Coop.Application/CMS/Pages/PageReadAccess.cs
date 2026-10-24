using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;

namespace Coop.Application.CMS.Pages;

/// <summary>Who may read unpublished pages: the office, or anyone holding a valid preview token (L2-REQ-123 AC5, L2-REQ-125 AC3).</summary>
public static class PageReadAccess
{
    public static bool SeesUnpublished(ClaimsPrincipal user, IPreviewTokenService tokens, string? previewToken)
        => CallerAccess.IsOffice(user) || (previewToken is not null && tokens.IsValid(previewToken));
}
