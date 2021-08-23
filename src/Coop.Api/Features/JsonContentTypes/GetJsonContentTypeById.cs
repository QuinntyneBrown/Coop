using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetJsonContentTypeById
    {
        public class Request: IRequest<Response>
        {
            public Guid JsonContentTypeId { get; set; }
        }

        public class Response: ResponseBase
        {
            public JsonContentTypeDto JsonContentType { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    JsonContentType = (await _context.JsonContentTypes
                    .Include(x => x.JsonContents)
                    .SingleOrDefaultAsync(x => x.JsonContentTypeId == request.JsonContentTypeId)).ToDto()
                };
            }
            
        }
    }
}