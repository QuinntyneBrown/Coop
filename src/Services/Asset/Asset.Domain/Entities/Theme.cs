// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json.Linq;

namespace Asset.Domain.Entities;

public class Theme
{
    public Guid ThemeId { get; private set; } = Guid.NewGuid();
    public Guid? ProfileId { get; private set; }
    public JObject CssCustomProperties { get; private set; } = new();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private Theme() { }

    public Theme(JObject cssCustomProperties, Guid? profileId = null)
    {
        CssCustomProperties = cssCustomProperties;
        ProfileId = profileId;
    }

    public void UpdateCssCustomProperties(JObject cssCustomProperties)
    {
        CssCustomProperties = cssCustomProperties;
        UpdatedAt = DateTime.UtcNow;
    }
}
