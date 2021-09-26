using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Api.Extensions;
using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Api.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetMembersPage
    {
        public class Request : IRequest<Response>
        {
            public int PageSize { get; set; }
            public int Index { get; set; }
        }

        public class Response : ResponseBase
        {
            public int Length { get; set; }
            public List<MemberDto> Entities { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var query = from member in _context.Members
                            select member;

                var length = await _context.Members.CountAsync();

                var members = await query.Page(request.Index, request.PageSize)
                    .Select(x => x.ToDto()).ToListAsync();

                return new()
                {
                    Length = length,
                    Entities = members
                };
            }

        }
    }
}
