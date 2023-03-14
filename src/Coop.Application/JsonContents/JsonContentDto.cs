// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json.Linq;
using System;

namespace Coop.Application.JsonContents;

public class JsonContentDto
{
    public Guid? JsonContentId { get; set; }
    public string Name { get; set; } = "";
    public JObject Json { get; set; } = JObject.FromObject(new { });
}

