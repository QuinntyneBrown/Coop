// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Coop.Domain;
using Coop.Application.Common.Extensions;
using Coop.Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetUsersPageRequest : IRequest<GetUsersPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetUsersPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<UserDto> Entities { get; set; }
}
public class GetUsersPageHandler : IRequestHandler<GetUsersPageRequest, GetUsersPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetUsersPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetUsersPageResponse> Handle(GetUsersPageRequest request, CancellationToken cancellationToken)
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

