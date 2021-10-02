using Coop.Core;
using Coop.Core.DomainEvents.Document;
using Coop.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

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

                document.Apply(new DeleteDocument());

                _context.Documents.Remove(document);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Document = document.ToDto()
                };
            }

        }
    }
}
