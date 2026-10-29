using System.Text.Json;
using FluentValidation;

namespace Coop.Application.CMS.SiteContent;

/// <summary>
/// The rule for every <c>fr</c> object in the site content or a page
/// (L2-REQ-129 AC3, ADR 0023): each value is a text or a list of texts, and
/// no text is longer than <see cref="SiteContentRules.TextMaxLength"/>.
/// </summary>
public static class FrenchText
{
    public const string InvalidMessage = "Keep each French text under 2000 characters.";

    private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

    public static IRuleBuilderOptions<T, TProperty> ValidFrench<T, TProperty>(this IRuleBuilder<T, TProperty> rule)
        => rule.Must(value => IsValid(value)).WithMessage(InvalidMessage);

    /// <summary>True when every <c>fr</c> object found anywhere in the value holds only valid French text.</summary>
    public static bool IsValid(object? value)
        => value is null || Walk(JsonSerializer.SerializeToElement(value, value.GetType(), Options));

    private static bool Walk(JsonElement element) => element.ValueKind switch
    {
        JsonValueKind.Object => element.EnumerateObject().All(property =>
            property.NameEquals("fr") ? IsFrench(property.Value) : Walk(property.Value)),
        JsonValueKind.Array => element.EnumerateArray().All(Walk),
        _ => true,
    };

    private static bool IsFrench(JsonElement fr)
        => fr.ValueKind == JsonValueKind.Null
            || fr.ValueKind == JsonValueKind.Object && fr.EnumerateObject().All(value => value.Value.ValueKind switch
            {
                JsonValueKind.String => IsText(value.Value),
                JsonValueKind.Array => value.Value.EnumerateArray().All(item => item.ValueKind == JsonValueKind.String && IsText(item)),
                _ => false,
            });

    private static bool IsText(JsonElement text) => text.GetString()!.Length <= SiteContentRules.TextMaxLength;
}
