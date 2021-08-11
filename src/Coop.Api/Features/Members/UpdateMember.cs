using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateMember
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Member).NotNull();
                RuleFor(request => request.Member).SetValidator(new MemberValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public MemberDto Member { get; set; }
        }

        public class Response: ResponseBase
        {
            public MemberDto Member { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var member = await _context.Members.SingleAsync(x => x.MemberId == request.Member.MemberId);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    Member = member.ToDto()
                };
            }
            
        }
    }
}
