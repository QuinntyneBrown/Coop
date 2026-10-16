namespace Coop.Application.Common.Interfaces;

/// <summary>The co-op the current request is for (ADR 0009).</summary>
public interface ITenantContext
{
    Guid TenantId { get; }
    string Slug { get; }
}
