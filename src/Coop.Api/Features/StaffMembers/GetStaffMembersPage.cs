using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Api.Extensions;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetStaffMembersPage
    {
        public class Request : IRequest<Response>
        {
            public int PageSize { get; set; }
            public int Index { get; set; }
        }

        public class Response : ResponseBase
        {
            public int Length { get; set; }
            public List<StaffMemberDto> Entities { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var query = from staffMember in _context.StaffMembers
                            select staffMember;

                var length = await _context.StaffMembers.CountAsync();

                var staffMembers = await query.Page(request.Index, request.PageSize)
                    .Select(x => x.ToDto()).ToListAsync();

                return new()
                {
                    Length = length,
                    Entities = staffMembers
                };
            }

        }
    }
}
