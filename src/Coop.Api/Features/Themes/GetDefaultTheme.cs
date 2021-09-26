using Coop.Core;
using Coop.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetDefaultTheme
    {
        public class Request : IRequest<Response>
        {
        }

        public class Response : ResponseBase
        {
            public ThemeDto Theme { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new()
                {
                    Theme = (await _context.Themes.SingleOrDefaultAsync(x => x.ProfileId == null)).ToDto()
                };
            }

        }
    }
}
