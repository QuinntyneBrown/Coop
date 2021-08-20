using Coop.Api.Core;
using Coop.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetSystemCssCustomProperties
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<CssCustomPropertyDto> CssCustomProperties { get; set; }
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
                    CssCustomProperties = await _context.CssCustomProperties
                    .Where(x => x.Type == Models.CssCustomPropertyType.System)
                    .Select(x => x.ToDto()).ToListAsync()
                };
            }

        }
    }
}
