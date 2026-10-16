namespace Coop.Domain.Tenancy;

/// <summary>
/// One co-operative served by the platform, reached at the sub-domain {Slug}
/// of the platform's base domain (ADR 0009).
/// </summary>
public class Tenant
{
    public const int SlugMinLength = 3;
    public const int SlugMaxLength = 63;

    public Guid TenantId { get; set; } = Guid.NewGuid();
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    /// <summary>True when the slug is 3 to 63 lowercase letters, digits and hyphens.</summary>
    public static bool IsValidSlug(string slug) =>
        slug.Length is >= SlugMinLength and <= SlugMaxLength
        && slug.All(c => c is >= 'a' and <= 'z' or >= '0' and <= '9' or '-');
}
