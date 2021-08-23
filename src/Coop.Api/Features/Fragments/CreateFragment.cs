using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateFragment
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
                var fragment = new Fragment(request.Fragment.Name, new (request.Fragment.HtmlContent.Name, request.Fragment.HtmlContent.Body));
                
                _context.Fragments.Add(fragment);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new ()
                {
                    Fragment = fragment.ToDto()
                };
            }
            
        }
    }
}
