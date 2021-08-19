using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveHtmlContent
    {
        public class Request : IRequest<Response>
        {
            public Guid HtmlContentId { get; set; }
        }

        public class Response : ResponseBase
        {
            public HtmlContentDto HtmlContent { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var htmlContent = await _context.HtmlContents.SingleAsync(x => x.HtmlContentId == request.HtmlContentId);

                _context.HtmlContents.Remove(htmlContent);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    HtmlContent = htmlContent.ToDto()
                };
            }

        }
    }
}
