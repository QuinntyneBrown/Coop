using MediatR;

namespace Coop.Application.Profiles.Commands.RemoveProfileAvatar;

public class RemoveProfileAvatarRequest : IRequest<RemoveProfileAvatarResponse>
{
    public Guid ProfileId { get; set; }
}
