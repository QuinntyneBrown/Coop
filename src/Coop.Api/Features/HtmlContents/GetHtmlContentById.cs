using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetHtmlContentById
    {
        public class Request: IRequest<Response>
        {
            public Guid HtmlContentId { get; set; }
        }

        public class Response: ResponseBase
        {
            public HtmlContentDto HtmlContent { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    HtmlContent = (await _context.HtmlContents.SingleOrDefaultAsync(x => x.HtmlContentId == request.HtmlContentId)).ToDto()
                };
            }
            
        }
    }
}
