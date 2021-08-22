using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateFragment
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Fragment).NotNull();
                RuleFor(request => request.Fragment).SetValidator(new FragmentValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public FragmentDto Fragment { get; set; }
        }

        public class Response: ResponseBase
        {
            public FragmentDto Fragment { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var fragment = await _context.Fragments.SingleAsync(x => x.FragmentId == request.Fragment.FragmentId);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    Fragment = fragment.ToDto()
                };
            }
            
        }
    }
}
