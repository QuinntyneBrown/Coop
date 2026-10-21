using System.Text.Json;

namespace Coop.Cli;

/// <summary>Reads and writes the files and JSON the operator gives the tool.</summary>
public static class CliFiles
{
    /// <summary>The API's own JSON shape: camel-case names (L2-REQ-108 AC1).</summary>
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { WriteIndented = true };

    public static string ReadText(string path)
        => File.Exists(path) ? File.ReadAllText(path) : throw new CliException($"No file at \"{path}\".");

    public static byte[] ReadBytes(string path)
        => File.Exists(path) ? File.ReadAllBytes(path) : throw new CliException($"No file at \"{path}\".");

    public static T ReadJson<T>(string path)
    {
        var text = ReadText(path);
        try
        {
            return JsonSerializer.Deserialize<T>(text, Json) ?? throw new CliException($"\"{path}\" holds no content.");
        }
        catch (JsonException ex)
        {
            throw new CliException($"\"{path}\" is not valid JSON: {ex.Message}");
        }
    }

    /// <summary>Writes the value as JSON to the file, or to the output when no file is given.</summary>
    public static void WriteJson<T>(CommandContext context, string? path, T value)
    {
        var text = JsonSerializer.Serialize(value, Json);
        if (string.IsNullOrWhiteSpace(path))
        {
            context.Output.WriteLine(text);
            return;
        }
        File.WriteAllText(path, text + Environment.NewLine);
        context.Output.WriteLine($"Wrote \"{path}\".");
    }
}
