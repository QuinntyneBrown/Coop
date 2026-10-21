using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetProfilesByUserId;

public class GetProfilesByUserIdHandler : IRequestHandler<GetProfilesByUserIdRequest, GetProfilesByUserIdResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetProfilesByUserIdHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetProfilesByUserIdResponse> Handle(GetProfilesByUserIdRequest request, CancellationToken cancellationToken)
    {
        if (request.UserId != CallerAccess.UserId(_user) && !await ProfileAccess.IsOfficeAsync(_authorization, _user))
            throw new UnauthorizedAccessException("Access denied.");

        var profiles = await _context.Profiles.Where(p => p.UserId == request.UserId && !p.IsDeleted).ToListAsync(cancellationToken);
        return new GetProfilesByUserIdResponse { Profiles = profiles.Select(ProfileDto.FromProfile).ToList() };
    }
}
