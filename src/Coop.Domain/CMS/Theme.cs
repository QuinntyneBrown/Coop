namespace Coop.Domain.CMS;

public class Theme
{
    public Guid ThemeId { get; set; } = Guid.NewGuid();
    public Guid? ProfileId { get; set; }
    public string CssCustomProperties { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
