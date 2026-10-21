using System.CommandLine;
using System.Text.Json;
using Coop.Infrastructure;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Coop.Cli;

/// <summary>
/// Runs a command's action: builds the same services as the API (ADR 0012)
/// for the chosen connection, runs the action in a scope as the operator
/// (ADR 0014) and turns failures into plain messages and exit codes.
/// </summary>
public class CliRunner
{
    private readonly Option<string?> _connection;
    private readonly Action<IServiceCollection>? _configureServices;

    public CliRunner(TextWriter output, TextWriter error, Option<string?> connection, Action<IServiceCollection>? configureServices)
    {
        Output = output;
        Error = error;
        _connection = connection;
        _configureServices = configureServices;
    }

    public TextWriter Output { get; }

    public TextWriter Error { get; }

    public void SetAction(Command command, Func<CommandContext, Task> action)
    {
        command.SetAction(async (parseResult, cancellationToken) =>
        {
            try
            {
                await using var services = BuildServices(parseResult.GetValue(_connection));
                await using var scope = services.CreateAsyncScope();
                await action(new CommandContext(parseResult, scope.ServiceProvider, Output, cancellationToken));
                return 0;
            }
            catch (ValidationException ex)
            {
                Error.WriteLine("Error:");
                foreach (var failure in ex.Errors)
                    Error.WriteLine(failure.ErrorMessage);
                return 1;
            }
            catch (Exception ex) when (ex is CliException or UnauthorizedAccessException or JsonException)
            {
                Error.WriteLine($"Error: {ex.Message}");
                return 1;
            }
        });
    }

    private ServiceProvider BuildServices(string? connection)
    {
        var settings = new Dictionary<string, string?>();
        if (!string.IsNullOrWhiteSpace(connection))
            settings["ConnectionStrings:DefaultConnection"] = connection;

        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .AddInMemoryCollection(settings)
            .Build();

        var services = new ServiceCollection();
        services.AddSingleton<IConfiguration>(configuration);
        services.AddLogging(logging => logging
            .AddConfiguration(configuration.GetSection("Logging"))
            .AddSimpleConsole(options => options.SingleLine = true));
        services.AddCoopCore(configuration);
        services.AddAuthorizationCore();
        services.AddHttpContextAccessor();
        services.AddScoped(_ => OperatorIdentity.Create());
        _configureServices?.Invoke(services);
        return services.BuildServiceProvider();
    }
}
