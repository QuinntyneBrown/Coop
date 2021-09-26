using MediatR;
using Microsoft.EntityFrameworkCore;
using Coop.Core;
using Coop.Api.Extensions;
using Coop.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetUsersPage
    {
        public class Request : IRequest<Response>
        {
            public int PageSize { get; set; }
            public int Index { get; set; }
        }

        public class Response : ResponseBase
        {
            public int Length { get; set; }
            public List<UserDto> Entities { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var query = from user in _context.Users
                            select user;

                var length = await _context.Users.CountAsync();

                var users = await query.Page(request.Index, request.PageSize)
                    .Include(x => x.Profiles)
                    .Include(x => x.Roles)
                    .Include("Roles.Privileges")
                    .Select(x => x.ToDto()).ToListAsync();

                return new()
                {
                    Length = length,
                    Entities = users
                };
            }

        }
    }
}
