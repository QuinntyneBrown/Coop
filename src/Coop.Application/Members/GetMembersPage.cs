// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMembersPageRequest : IRequest<GetMembersPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetMembersPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<MemberDto> Entities { get; set; }
}
public class GetMembersPageHandler : IRequestHandler<GetMembersPageRequest, GetMembersPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetMembersPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMembersPageResponse> Handle(GetMembersPageRequest request, CancellationToken cancellationToken)
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

