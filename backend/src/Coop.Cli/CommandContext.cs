using System.CommandLine;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Cli;

/// <summary>What a command's action works with: its parsed options, the scoped services and the output.</summary>
public class CommandContext
{
    public CommandContext(ParseResult parseResult, IServiceProvider services, TextWriter output, CancellationToken cancellationToken)
    {
        ParseResult = parseResult;
        Services = services;
        Output = output;
        CancellationToken = cancellationToken;
    }

    public ParseResult ParseResult { get; }

    public IServiceProvider Services { get; }

    public TextWriter Output { get; }

    public CancellationToken CancellationToken { get; }

    public T Value<T>(Option<T> option) => ParseResult.GetValue(option)!;

    public T Required<T>(Option<T> option) => ParseResult.GetRequiredValue(option);

    public Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request)
        => Services.GetRequiredService<IMediator>().Send(request, CancellationToken);
}
