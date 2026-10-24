namespace Coop.Application.Common.Interfaces;

/// <summary>
/// Issues and checks the short-lived, read-only tokens that let the public
/// site show the site content draft (L2-REQ-125, ADR 0019). A token carries
/// an expiry and a signature, nothing else: it names no one and is no bearer
/// token.
/// </summary>
public interface IPreviewTokenService
{
    /// <summary>A token that is valid until <paramref name="expiresOn"/>.</summary>
    string Issue(DateTimeOffset expiresOn);

    /// <summary>True when the token was issued here and has not expired.</summary>
    bool IsValid(string? token);
}
