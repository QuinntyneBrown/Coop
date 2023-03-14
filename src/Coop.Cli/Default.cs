using CommandLine;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Cli;

[Verb("default")]
public class DefaultRequest : IRequest<Unit> { }
public class DefaultHandler : IRequestHandler<DefaultRequest, Unit>
{
    private readonly ICommandService _commandService;
    public DefaultHandler(ICommandService commandService)
    {
        _commandService = commandService;
    }
    public async Task<Unit> Handle(DefaultRequest request, CancellationToken cancellationToken)
    {
        _commandService.Start(@"code .", @"C:\projects\Coop\src\Coop.App");
        _commandService.Start(@"start Coop.Api.csproj", @"C:\projects\Coop\src\Coop.Api");
        return new();
    }
}
