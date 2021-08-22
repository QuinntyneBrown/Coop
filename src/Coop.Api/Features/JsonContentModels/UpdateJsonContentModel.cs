using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateJsonContentModel
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.JsonContentModel).NotNull();
                RuleFor(request => request.JsonContentModel).SetValidator(new JsonContentModelValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public JsonContentModelDto JsonContentModel { get; set; }
        }

        public class Response: ResponseBase
        {
            public JsonContentModelDto JsonContentModel { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var jsonContentModel = await _context.JsonContentModels.SingleAsync(x => x.JsonContentModelId == request.JsonContentModel.JsonContentModelId);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    JsonContentModel = jsonContentModel.ToDto()
                };
            }
            
        }
    }
}
