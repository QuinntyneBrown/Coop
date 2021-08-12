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
    public class RemoveDocument
    {
        public class Request : IRequest<Response>
        {
            public Guid DocumentId { get; set; }
        }

        public class Response : ResponseBase
        {
            public DocumentDto Document { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var document = await _context.Documents.SingleAsync(x => x.DocumentId == request.DocumentId);

                _context.Documents.Remove(document);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Document = document.ToDto()
                };
            }

        }
    }
}
