namespace Coop.Cli;

internal static class Program
{
    private static Task<int> Main(string[] args) => CliApp.RunAsync(args, Console.Out, Console.Error);
}
