namespace Coop.Cli;

/// <summary>Writes rows as plain, left-aligned columns under upper-case headings.</summary>
public static class Table
{
    public static void Write(TextWriter output, IReadOnlyList<string> headings, IEnumerable<IReadOnlyList<string>> rows)
    {
        var all = new List<IReadOnlyList<string>> { headings.Select(h => h.ToUpperInvariant()).ToList() };
        all.AddRange(rows);
        var widths = headings.Select((_, column) => all.Max(row => row[column].Length)).ToArray();
        foreach (var row in all)
            output.WriteLine(string.Join("  ", row.Select((cell, column) => column == row.Count - 1 ? cell : cell.PadRight(widths[column]))).TrimEnd());
    }
}
