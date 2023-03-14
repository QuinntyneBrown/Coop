using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveProfileRequest : IRequest<RemoveProfileResponse>
{
    public Guid ProfileId { get; set; }
}
public class RemoveProfileResponse : ResponseBase
{
    public ProfileDto Profile { get; set; }
}
public class RemoveProfileHandler : IRequestHandler<RemoveProfileRequest, RemoveProfileResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveProfileHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveProfileResponse> Handle(RemoveProfileRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == request.ProfileId);
        _context.Profiles.Remove(profile);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveProfileResponse()
        {
            Profile = profile.ToDto()
        };
    }
}
