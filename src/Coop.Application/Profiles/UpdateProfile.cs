using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Profile).NotNull();
        RuleFor(request => request.Profile).SetValidator(new ProfileValidator());
    }
}
public class UpdateProfileRequest : IRequest<UpdateProfileResponse>
{
    public ProfileDto Profile { get; set; }
}
public class UpdateProfileResponse : ResponseBase
{
    public ProfileDto Profile { get; set; }
}
public class UpdateProfileHandler : IRequestHandler<UpdateProfileRequest, UpdateProfileResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateProfileHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateProfileResponse> Handle(UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == request.Profile.ProfileId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateProfileResponse()
        {
            Profile = profile.ToDto()
        };
    }
}
