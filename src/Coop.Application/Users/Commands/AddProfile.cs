using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class AddProfileRequest : IRequest<AddProfileResponse>
{
    public Guid UserId { get; set; }
    public Guid ProfileId { get; set; }
    public void Deconstruct(out Guid userId, out Guid profileId)
    {
        userId = UserId;
        profileId = ProfileId;
    }
}
public class AddProfileResponse
{
    public UserDto User { get; set; }
}
public class AddProfileHandler : IRequestHandler<AddProfileRequest, AddProfileResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IOrchestrationHandler _messageHandlerContext;
    public AddProfileHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext)
    {
        _context = context;
        _messageHandlerContext = messageHandlerContext;
    }
    public async Task<AddProfileResponse> Handle(AddProfileRequest request, CancellationToken cancellationToken)
    {
        var (userId, profileId) = request;
        var user = await _context.Users.Include(x => x.Profiles).SingleAsync(x => x.UserId == userId);
        var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == profileId);
        user.AddProfile(profile);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            User = user.ToDto()
        };
    }
}
