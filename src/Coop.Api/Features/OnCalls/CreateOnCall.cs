using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateOnCall
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.OnCall).NotNull();
                RuleFor(request => request.OnCall).SetValidator(new OnCallValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public OnCallDto OnCall { get; set; }
        }

        public class Response: ResponseBase
        {
            public OnCallDto OnCall { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var onCall = new OnCall(request.OnCall.UserId, request.OnCall.Firstname, request.OnCall.Lastname);
                
                _context.OnCalls.Add(onCall);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new ()
                {
                    OnCall = onCall.ToDto()
                };
            }
            
        }
    }
}
