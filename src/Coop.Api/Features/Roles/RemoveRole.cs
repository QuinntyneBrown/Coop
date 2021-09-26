using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveRole
    {
        public class Request : IRequest<Response>
        {
            public Guid RoleId { get; set; }
        }

        public class Response : ResponseBase
        {
            public RoleDto Role { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var role = await _context.Roles.SingleAsync(x => x.RoleId == request.RoleId);

                _context.Roles.Remove(role);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Role = role.ToDto()
                };
            }

        }
    }
}
