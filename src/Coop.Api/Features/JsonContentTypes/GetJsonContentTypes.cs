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
    public class GetJsonContentTypes
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<JsonContentTypeDto> JsonContentTypes { get; set; }
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
                    JsonContentTypes = await _context.JsonContentTypes
                    .Include(x => x.JsonContents)
                    .Select(x => x.ToDto()).ToListAsync()
                };
            }

        }
    }
}
