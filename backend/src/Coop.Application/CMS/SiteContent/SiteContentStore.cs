using System.Text.Json;
using Coop.Application.Common.Interfaces;
using Coop.Domain.CMS;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.SiteContent;

/// <summary>
/// Reads the published and draft site content entries as the JSON they
/// hold, so a value an older entry lacks stays absent (L2-REQ-100 AC3).
/// </summary>
public static class SiteContentStore
{
    public static Task<JsonContent?> FindAsync(ICoopDbContext context, string name, CancellationToken cancellationToken)
        => context.JsonContents.FirstOrDefaultAsync(x => x.Name == name && !x.IsDeleted, cancellationToken);

    /// <summary>The entry's JSON object, or null when there is no entry or it holds no object.</summary>
    public static async Task<JsonElement?> ReadAsync(ICoopDbContext context, string name, CancellationToken cancellationToken)
    {
        var content = await context.JsonContents.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Name == name && !x.IsDeleted, cancellationToken);
        return Parse(content?.Json);
    }

    public static JsonElement? Parse(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return null;
        try
        {
            using var document = JsonDocument.Parse(json);
            return document.RootElement.ValueKind == JsonValueKind.Object ? document.RootElement.Clone() : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
