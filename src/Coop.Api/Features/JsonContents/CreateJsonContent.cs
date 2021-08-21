using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using System.Text.Json;

namespace Coop.Api.Features
{
    public class CreateJsonContent
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.JsonContent).NotNull();
                RuleFor(request => request.JsonContent).SetValidator(new JsonContentValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public JsonContentDto JsonContent { get; set; }
        }

        public class Response: ResponseBase
        {
            public JsonContentDto JsonContent { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var jsonContent = new JsonContent(request.JsonContent.Json);

                
                _context.JsonContents.Add(jsonContent);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    JsonContent = jsonContent.ToDto()
                };
            }
            
        }
    }
}