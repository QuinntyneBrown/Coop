using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Core;
using Coop.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetPrivileges
    {
        public class Request : IRequest<Response> { }

        public class Response : ResponseBase
        {
            public List<PrivilegeDto> Privileges { get; set; }
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
                    Privileges = await _context.Privileges.Select(x => x.ToDto()).ToListAsync()
                };
            }

        }
    }
}
