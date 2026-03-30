using MediatR;

namespace Coop.Application.Profiles.Commands.SetProfileAvatar;

public class SetProfileAvatarRequest : IRequest<SetProfileAvatarResponse>
{
    public Guid ProfileId { get; set; }
    public Guid DigitalAssetId { get; set; }
}
