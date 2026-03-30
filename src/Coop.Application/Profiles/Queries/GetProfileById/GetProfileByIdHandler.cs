using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetProfileById;

public class GetProfileByIdHandler : IRequestHandler<GetProfileByIdRequest, GetProfileByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetProfileByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetProfileByIdResponse> Handle(GetProfileByIdRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(p => p.ProfileId == request.ProfileId, cancellationToken);
        return new GetProfileByIdResponse { Profile = ProfileDto.FromProfile(profile) };
    }
}
