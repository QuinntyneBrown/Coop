using Coop.Api.Core;
using Coop.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetJsonContentTypeByName
    {
        public class Request : IRequest<Response>
        {
            public string Name { get; set; }
        }

        public class Response : ResponseBase
        {
            public JsonContentTypeDto JsonContentType { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new()
                {
                    JsonContentType = (await _context.JsonContentTypes
                    .Include(x => x.JsonContents)
                    .SingleOrDefaultAsync(x => x.Name.ToLower() == request.Name.ToLower())).ToDto()
                };
        }
    }
}
