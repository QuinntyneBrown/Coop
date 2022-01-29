using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Core;
using Coop.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetJsonContents
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<JsonContentDto> JsonContents { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var json = _context.JsonContents.ToList();

                return new()
                {
                    JsonContents = json.Select(x => x.ToDto()).ToList()
                };
            }

        }
    }
}
