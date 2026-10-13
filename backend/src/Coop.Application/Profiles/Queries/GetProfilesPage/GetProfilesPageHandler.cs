using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetProfilesPage;

public class GetProfilesPageHandler : IRequestHandler<GetProfilesPageRequest, GetProfilesPageResponse>
{
    private readonly ICoopDbContext _context;

    public GetProfilesPageHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetProfilesPageResponse> Handle(GetProfilesPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Profiles.Where(p => !p.IsDeleted);
        var totalCount = await query.CountAsync(cancellationToken);
        var profiles = await query.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);

        return new GetProfilesPageResponse
        {
            Profiles = profiles.Select(ProfileDto.FromProfile).ToList(),
            TotalCount = totalCount,
            PageSize = request.PageSize,
            PageIndex = request.Index
        };
    }
}
