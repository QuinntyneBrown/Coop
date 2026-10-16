namespace Coop.Domain.Tenancy;

/// <summary>An entity that belongs to exactly one co-op (ADR 0009).</summary>
public interface ITenantOwned
{
    Guid TenantId { get; set; }
}
