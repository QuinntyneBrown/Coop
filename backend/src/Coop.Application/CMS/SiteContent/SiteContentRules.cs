using FluentValidation;

namespace Coop.Application.CMS.SiteContent;

/// <summary>
/// Rules shared by every block of the site content (L2-REQ-097, L2-REQ-098,
/// L2-REQ-099 AC5): safe link and photo addresses and the length limits.
/// </summary>
public static class SiteContentRules
{
    /// <summary>The JSON content entry that holds the published site content.</summary>
    public const string Name = "SiteContent";

    /// <summary>The JSON content entry that holds the unpublished draft, present only while one exists (ADR 0018).</summary>
    public const string DraftName = "SiteContentDraft";

    /// <summary>How long a preview token lets the public site read the draft (L2-REQ-125 AC1).</summary>
    public static readonly TimeSpan PreviewTokenLifetime = TimeSpan.FromMinutes(60);

    public const int TextMaxLength = 2000;
    public const int LinkLabelMaxLength = 100;
    public const int AddressMaxLength = 2048;
    public const int PhotoDescriptionMaxLength = 250;
    public const int PhotoSizeMax = 10000;

    public const string UnsafeLinkMessage = "Use a page on this site, a web address, an e-mail address or a phone number.";
    public const string UnsafePhotoMessage = "Use a photo from the Assets library or a page address on this site.";
    public const string MissingPhotoDescriptionMessage = "Describe this photo for people who cannot see it";
    public const string LongPhotoDescriptionMessage = "Keep the description under 250 characters";

    /// <summary>
    /// A site path starting with one "/" (optionally with a #section), an
    /// http(s) address, a mailto: address or a tel: number.
    /// </summary>
    public static bool IsSafeLink(string? href)
    {
        if (string.IsNullOrWhiteSpace(href)) return false;
        return IsSitePath(href)
            || IsWebAddress(href)
            || href.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase) && href.Length > 7
            || href.StartsWith("tel:", StringComparison.OrdinalIgnoreCase) && href.Length > 4;
    }

    /// <summary>A site path starting with one "/" or an http(s) address.</summary>
    public static bool IsSafeImageAddress(string? src)
        => !string.IsNullOrWhiteSpace(src) && (IsSitePath(src) || IsWebAddress(src));

    private static bool IsSitePath(string value)
        => value.StartsWith('/') && !value.StartsWith("//") && !value.StartsWith("/\\");

    private static bool IsWebAddress(string value)
        => Uri.TryCreate(value, UriKind.Absolute, out var uri)
            && (uri.Scheme == Uri.UriSchemeHttps || uri.Scheme == Uri.UriSchemeHttp)
            && !string.IsNullOrEmpty(uri.Host);

    public static IRuleBuilderOptions<T, string> ContentText<T>(this IRuleBuilder<T, string> rule)
        => rule.NotNull().MaximumLength(TextMaxLength);

    public static IRuleBuilderOptions<T, string> RequiredText<T>(this IRuleBuilder<T, string> rule, string label)
        => rule.NotEmpty().WithMessage($"Fill in “{label}”").MaximumLength(TextMaxLength);
}
