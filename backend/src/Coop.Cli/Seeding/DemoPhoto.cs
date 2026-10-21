namespace Coop.Cli.Seeding;

/// <summary>One of the public app's photographs, embedded in the tool.</summary>
public record DemoPhoto(string FileName, byte[] Bytes, int Width, int Height);
