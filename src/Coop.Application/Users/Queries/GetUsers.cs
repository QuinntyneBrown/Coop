using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features
{
    public class GetUsers
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<UserDto> Users { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new()
                {
                    Users = await _context.Users
                    .Include(x => x.Profiles)
                    .Include(x => x.Roles)
                    .Include("Roles.Privileges")
                    .Select(x => x.ToDto()).ToListAsync()
                };
            }

        }
    }
}
