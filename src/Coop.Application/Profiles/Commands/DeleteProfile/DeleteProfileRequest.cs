using MediatR;

namespace Coop.Application.Profiles.Commands.DeleteProfile;

public class DeleteProfileRequest : IRequest<DeleteProfileResponse>
{
    public Guid ProfileId { get; set; }
}
