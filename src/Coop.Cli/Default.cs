using CommandLine;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Cli
{
    internal class Default
    {
        [Verb("default")]
        internal class Request : IRequest<Unit> { }

        internal class Handler : IRequestHandler<Request, Unit>
        {
            private readonly ICommandService _commandService;
            public Handler(ICommandService commandService)
            {
                _commandService = commandService;
            }
            public Task<Unit> Handle(Request request, CancellationToken cancellationToken)
            {
                _commandService.Start(@"code .", @"C:\projects\Coop\src\Coop.App");
                _commandService.Start(@"start Coop.Api.csproj", @"C:\projects\Coop\src\Coop.Api");

                return Task.FromResult(new());
            }
        }
    }
}
