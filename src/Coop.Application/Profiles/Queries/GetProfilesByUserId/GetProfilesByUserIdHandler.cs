using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetProfilesByUserId;

public class GetProfilesByUserIdHandler : IRequestHandler<GetProfilesByUserIdRequest, GetProfilesByUserIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetProfilesByUserIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetProfilesByUserIdResponse> Handle(GetProfilesByUserIdRequest request, CancellationToken cancellationToken)
    {
        var profiles = await _context.Profiles.Where(p => p.UserId == request.UserId && !p.IsDeleted).ToListAsync(cancellationToken);
        return new GetProfilesByUserIdResponse { Profiles = profiles.Select(ProfileDto.FromProfile).ToList() };
    }
}
