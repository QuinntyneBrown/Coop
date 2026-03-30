using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.DeleteProfile;

public class DeleteProfileHandler : IRequestHandler<DeleteProfileRequest, DeleteProfileResponse>
{
    private readonly ICoopDbContext _context;

    public DeleteProfileHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<DeleteProfileResponse> Handle(DeleteProfileRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(p => p.ProfileId == request.ProfileId, cancellationToken);
        profile.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new DeleteProfileResponse { Profile = ProfileDto.FromProfile(profile) };
    }
}
