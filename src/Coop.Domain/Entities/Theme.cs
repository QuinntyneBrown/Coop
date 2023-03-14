// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json.Linq;
using System;

namespace Coop.Domain.Entities;

public class Theme
{
    public Guid ThemeId { get; set; }
    public Guid? ProfileId { get; set; }
    public JObject CssCustomProperties { get; private set; }
    public Theme(Guid? profileId, JObject cssCustomProperties)
        : this(cssCustomProperties)
    {
        ProfileId = profileId;
    }
    public Theme(JObject cssCustomProperties)
    {
        CssCustomProperties = cssCustomProperties;
    }
    private Theme()
    {
    }
    public void SetCssCustomProperties(JObject cssCustomProperties)
    {
        CssCustomProperties = cssCustomProperties;
    }
}

