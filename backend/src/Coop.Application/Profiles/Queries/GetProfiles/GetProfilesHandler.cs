using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetProfiles;

public class GetProfilesHandler : IRequestHandler<GetProfilesRequest, GetProfilesResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public GetProfilesHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<GetProfilesResponse> Handle(GetProfilesRequest request, CancellationToken cancellationToken)
    {
        // A member lists only their own profiles; the office lists everyone's (L2-REQ-114).
        Guid? userId = await ProfileAccess.IsOfficeAsync(_authorization, _user) ? null : CallerAccess.UserId(_user) ?? Guid.Empty;
        var profiles = await _context.Profiles.Where(p => !p.IsDeleted && (userId == null || p.UserId == userId)).ToListAsync(cancellationToken);
        return new GetProfilesResponse { Profiles = profiles.Select(ProfileDto.FromProfile).ToList() };
    }
}
