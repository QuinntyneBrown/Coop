using Newtonsoft.Json.Linq;

namespace Coop.Domain.Assets;

public class Theme
{
    public Guid ThemeId { get; set; } = Guid.NewGuid();
    public Guid? ProfileId { get; set; }
    public JObject CssCustomProperties { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public void SetCssCustomProperties(JObject cssCustomProperties)
    {
        CssCustomProperties = cssCustomProperties;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateCssCustomProperties(JObject cssCustomProperties)
    {
        foreach (var property in cssCustomProperties.Properties())
        {
            CssCustomProperties[property.Name] = property.Value;
        }

        UpdatedAt = DateTime.UtcNow;
    }
}
