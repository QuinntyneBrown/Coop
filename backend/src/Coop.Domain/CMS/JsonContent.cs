using Coop.Domain.Tenancy;

namespace Coop.Domain.CMS;

public class JsonContent : ITenantOwned
{
    public Guid JsonContentId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Json { get; set; } = "{}";
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
