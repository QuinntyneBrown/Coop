// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json.Linq;

namespace Document.Domain.Entities;

public class JsonContent
{
    public Guid JsonContentId { get; private set; } = Guid.NewGuid();
    public string Name { get; private set; } = string.Empty;
    public JObject Json { get; private set; } = new();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private JsonContent() { }

    public JsonContent(string name, JObject json)
    {
        Name = name;
        Json = json;
    }

    public void UpdateJson(JObject json)
    {
        Json = json;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetName(string name)
    {
        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }
}

public static class JsonContentName
{
    public const string Hero = nameof(Hero);
    public const string BoardOfDirectors = nameof(BoardOfDirectors);
}
