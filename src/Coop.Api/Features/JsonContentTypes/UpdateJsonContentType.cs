using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateJsonContentType
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.JsonContentType).NotNull();
                RuleFor(request => request.JsonContentType).SetValidator(new JsonContentTypeValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public JsonContentTypeDto JsonContentType { get; set; }
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
                var jsonContentType = await _context.JsonContentTypes.SingleAsync(x => x.JsonContentTypeId == request.JsonContentType.JsonContentTypeId);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    JsonContentType = jsonContentType.ToDto()
                };
            }
            
        }
    }
}
