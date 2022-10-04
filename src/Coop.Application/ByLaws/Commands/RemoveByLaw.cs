using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features
{
    public class RemoveByLaw
    {
        public class Request : IRequest<Response>
        {
            public Guid ByLawId { get; set; }
        }

        public class Response : ResponseBase
        {
            public ByLawDto ByLaw { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var byLaw = await _context.ByLaws.SingleAsync(x => x.ByLawId == request.ByLawId);

                _context.ByLaws.Remove(byLaw);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    ByLaw = byLaw.ToDto()
                };
            }

        }
    }
}
