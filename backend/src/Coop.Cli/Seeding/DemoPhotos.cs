using System.Text.RegularExpressions;

namespace Coop.Cli.Seeding;

/// <summary>
/// Reads the public app's photographs that the project links in as embedded
/// resources (<c>Photos.{file}.svg</c>), with the width and height of each
/// one's view box. The built-in "Photo not available" image stays in the app.
/// </summary>
public static partial class DemoPhotos
{
    private const string Prefix = "Photos.";
    private const string PhotoUnavailable = "photo-unavailable.svg";

    public static IReadOnlyList<DemoPhoto> All()
    {
        var assembly = typeof(DemoPhotos).Assembly;
        return assembly.GetManifestResourceNames()
            .Where(name => name.StartsWith(Prefix) && name != Prefix + PhotoUnavailable)
            .Order()
            .Select(name =>
            {
                using var stream = assembly.GetManifestResourceStream(name)!;
                using var memory = new MemoryStream();
                stream.CopyTo(memory);
                var bytes = memory.ToArray();
                var viewBox = ViewBox().Match(System.Text.Encoding.UTF8.GetString(bytes));
                return new DemoPhoto(name[Prefix.Length..], bytes, int.Parse(viewBox.Groups[1].Value), int.Parse(viewBox.Groups[2].Value));
            })
            .ToList();
    }

    [GeneratedRegex("viewBox=\"0 0 (\\d+) (\\d+)\"")]
    private static partial Regex ViewBox();
}
