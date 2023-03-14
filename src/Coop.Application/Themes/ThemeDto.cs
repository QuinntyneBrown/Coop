// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json.Linq;
using System;

namespace Coop.Application.Features;

public class ThemeDto
{
    public Guid ThemeId { get; set; }
    public Guid? ProfileId { get; set; }
    public JObject CssCustomProperties { get; set; }
}

