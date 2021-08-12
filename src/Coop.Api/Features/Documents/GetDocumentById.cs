using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetDocumentById
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
                return new()
                {
                    Document = (await _context.Documents.SingleOrDefaultAsync(x => x.DocumentId == request.DocumentId)).ToDto()
                };
            }

        }
    }
}
