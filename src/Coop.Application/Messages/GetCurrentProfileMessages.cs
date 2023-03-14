// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Coop.Domain;

namespace Coop.Application.Features;

public class GetCurrentProfileMessagesRequest : IRequest<GetCurrentProfileMessagesResponse> { }
public class GetCurrentProfileMessagesResponse : ResponseBase
{
    public List<MessageDto> Messages { get; set; }
}
public class GetCurrentProfileMessagesHandler : IRequestHandler<GetCurrentProfileMessagesRequest, GetCurrentProfileMessagesResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public GetCurrentProfileMessagesHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<GetCurrentProfileMessagesResponse> Handle(GetCurrentProfileMessagesRequest request, CancellationToken cancellationToken)
    {
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        var user = await _context.Users.FindAsync(userId);
        var profile = await _context.Profiles.FindAsync(user.CurrentProfileId);
        return new()
        {
            Messages = await _context.Messages
            .Where(x => x.ToProfileId == profile.ProfileId || x.FromProfileId == profile.ProfileId)
            .OrderByDescending(x => x.Created)
            .Select(x => x.ToDto()).ToListAsync()
        };
    }
}

