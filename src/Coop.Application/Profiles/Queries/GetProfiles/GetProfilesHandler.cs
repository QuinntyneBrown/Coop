using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetProfiles;

public class GetProfilesHandler : IRequestHandler<GetProfilesRequest, GetProfilesResponse>
{
    private readonly ICoopDbContext _context;

    public GetProfilesHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetProfilesResponse> Handle(GetProfilesRequest request, CancellationToken cancellationToken)
    {
        var profiles = await _context.Profiles.Where(p => !p.IsDeleted).ToListAsync(cancellationToken);
        return new GetProfilesResponse { Profiles = profiles.Select(ProfileDto.FromProfile).ToList() };
    }
}
