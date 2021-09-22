using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetStoredEvents
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<StoredEventDto> StoredEvents { get; set; }
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
                    StoredEvents = await _context.StoredEvents.Select(x => x.ToDto()).ToListAsync()
                };
            }

        }
    }
}