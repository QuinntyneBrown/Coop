using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateDocument
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Document).NotNull();
                RuleFor(request => request.Document).SetValidator(new DocumentValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public DocumentDto Document { get; set; }
        }

        public class Response: ResponseBase
        {
            public DocumentDto Document { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var document = await _context.Documents.SingleAsync(x => x.DocumentId == request.Document.DocumentId);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    Document = document.ToDto()
                };
            }
            
        }
    }
}
