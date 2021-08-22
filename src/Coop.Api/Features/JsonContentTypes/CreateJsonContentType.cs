using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateJsonContentType
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
                var jsonContentType = new JsonContentType(request.JsonContentType.Name);
                
                _context.JsonContentTypes.Add(jsonContentType);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    JsonContentType = jsonContentType.ToDto()
                };
            }
            
        }
    }
}
