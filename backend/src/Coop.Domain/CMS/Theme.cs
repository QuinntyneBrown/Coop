using Coop.Domain.Tenancy;

namespace Coop.Domain.CMS;

public class Theme : ITenantOwned
{
    public Guid ThemeId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid? ProfileId { get; set; }
    public string CssCustomProperties { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
