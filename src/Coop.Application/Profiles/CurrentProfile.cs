using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class CurrentProfileRequest : IRequest<CurrentProfileResponse> { }
public class CurrentProfileResponse
{
    public dynamic Profile { get; set; }
}
public class CurrentProfileHandler : IRequestHandler<CurrentProfileRequest, CurrentProfileResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CurrentProfileHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<CurrentProfileResponse> Handle(CurrentProfileRequest request, CancellationToken cancellationToken)
    {
        if (!_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
        {
            return new();
        }
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new();
        }
        var profile = await _context.Profiles
            .Include(x => x.Address)
            .SingleAsync(x => x.ProfileId == user.CurrentProfileId);
        return new()
        {
            Profile = profile.ToDto()
        };
    }
}
