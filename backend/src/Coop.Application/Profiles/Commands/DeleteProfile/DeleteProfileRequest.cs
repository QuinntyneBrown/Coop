using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Commands.DeleteProfile;

[OfficeOnly]
public class DeleteProfileRequest : IRequest<DeleteProfileResponse>
{
    public Guid ProfileId { get; set; }
}
