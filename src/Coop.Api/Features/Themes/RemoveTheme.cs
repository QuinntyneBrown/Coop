using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveTheme
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
                var theme = await _context.Themes.SingleAsync(x => x.ThemeId == request.ThemeId);

                _context.Themes.Remove(theme);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Theme = theme.ToDto()
                };
            }

        }
    }
}
