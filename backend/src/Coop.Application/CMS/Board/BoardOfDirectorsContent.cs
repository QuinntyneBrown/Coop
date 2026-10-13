using System.Text.Json;
using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Board;

/// <summary>
/// The board list is stored as the <c>BoardOfDirectors</c> JSON content entry
/// that the public home page reads: <c>{ "members": [{ "name", "title", "photoUrl" }] }</c>.
/// </summary>
public static class BoardOfDirectorsContent
{
    public const string Name = "BoardOfDirectors";

    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

    public static List<DirectorDto> Read(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new();
        try
        {
            using var document = JsonDocument.Parse(json);
            if (document.RootElement.ValueKind != JsonValueKind.Object
                || !document.RootElement.TryGetProperty("members", out var members)
                || members.ValueKind != JsonValueKind.Array)
                return new();

            return members.EnumerateArray()
                .Where(m => m.ValueKind == JsonValueKind.Object)
                .Select(m => new DirectorDto
                {
                    Name = Text(m, "name"),
                    // The first seed stored the role under "role".
                    Title = Text(m, "title") is { Length: > 0 } title ? title : Text(m, "role"),
                    PhotoUrl = Text(m, "photoUrl") is { Length: > 0 } photo ? photo : null,
                })
                .Where(d => d.Name.Length > 0)
                .ToList();
        }
        catch (JsonException)
        {
            return new();
        }
    }

    public static string Write(IEnumerable<DirectorDto> directors)
        => JsonSerializer.Serialize(new { members = directors }, Options);

    private static string Text(JsonElement element, string property)
        => element.TryGetProperty(property, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()!.Trim()
            : string.Empty;
}
