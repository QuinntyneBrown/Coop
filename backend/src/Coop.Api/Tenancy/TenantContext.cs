using Coop.Application.Common.Interfaces;
using Coop.Domain.Tenancy;

namespace Coop.Api.Tenancy;

/// <summary>Holds the current co-op for one request or seeding scope.</summary>
public class TenantContext : ITenantContext
{
    public Guid TenantId { get; private set; }
    public string Slug { get; private set; } = string.Empty;

    public void Set(Tenant tenant)
    {
        TenantId = tenant.TenantId;
        Slug = tenant.Slug;
    }
}
