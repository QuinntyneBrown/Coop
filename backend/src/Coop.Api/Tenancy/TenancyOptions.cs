namespace Coop.Api.Tenancy;

/// <summary>The <c>Tenancy</c> settings that say how a request names its co-op (ADR 0009).</summary>
public class TenancyOptions
{
    public const string SectionName = "Tenancy";

    /// <summary>Domain under which each co-op's sub-domain is read, for example <c>coop.example</c>.</summary>
    public string BaseDomain { get; set; } = string.Empty;

    /// <summary>Slug used when the host is not under the base domain, such as <c>localhost</c>.</summary>
    public string? DefaultTenant { get; set; }
}
