// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Application.Common.Extensions;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.BoardMembers;

public class GetBoardMembersPageRequest : IRequest<GetBoardMembersPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetBoardMembersPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<BoardMemberDto> Entities { get; set; }
}
public class GetBoardMembersPageHandler : IRequestHandler<GetBoardMembersPageRequest, GetBoardMembersPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetBoardMembersPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetBoardMembersPageResponse> Handle(GetBoardMembersPageRequest request, CancellationToken cancellationToken)
    {
        var query = from boardMember in _context.BoardMembers
                    select boardMember;
        var length = await _context.BoardMembers.CountAsync();
        var boardMembers = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = boardMembers
        };
    }
}

