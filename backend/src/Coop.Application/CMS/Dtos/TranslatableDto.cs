using System.Text.Json;
using System.Text.Json.Serialization;

namespace Coop.Application.CMS.Dtos;

/// <summary>
/// An item of the site content or of a page that holds text visitors read:
/// <c>Fr</c> holds the French of its own values, keyed by the English
/// value's name, each a text or a list of texts (L2-REQ-129, ADR 0023).
/// </summary>
public abstract class TranslatableDto
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, JsonElement>? Fr { get; set; }
}
