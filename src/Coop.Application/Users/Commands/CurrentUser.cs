// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using Coop.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class CurrentUserRequest : IRequest<CurrentUserResponse> { }
public class CurrentUserResponse
{
    public UserDto User { get; set; }
}
public class CurrentUserHandler : IRequestHandler<CurrentUserRequest, CurrentUserResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CurrentUserHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<CurrentUserResponse> Handle(CurrentUserRequest request, CancellationToken cancellationToken)
    {
        if (!_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
        {
            return new();
        }
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        User user = _context.Users
            .Include(x => x.Profiles)
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .Single(x => x.UserId == userId);
        return new()
        {
            User = user.ToDto()
        };
    }
}

