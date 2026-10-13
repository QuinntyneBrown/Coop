using MediatR;
using Microsoft.AspNetCore.Http;

namespace Coop.Application.Profiles.Commands.UploadProfileAvatar;

public class UploadProfileAvatarRequest : IRequest<UploadProfileAvatarResponse>
{
    public Guid ProfileId { get; set; }
    public IFormFile File { get; set; } = default!;
}
