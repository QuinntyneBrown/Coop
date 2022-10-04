using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
{
    public class GetThemeById
    {
        public class Request : IRequest<Response>
        {
            public Guid ThemeId { get; set; }
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
                    Theme = (await _context.Themes.SingleOrDefaultAsync(x => x.ThemeId == request.ThemeId)).ToDto()
                };
            }

        }
    }
}
