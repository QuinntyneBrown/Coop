using Coop.Domain.Identity;

namespace Coop.Application.Identity.Dtos;

public class UserDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public Guid? CurrentProfileId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public List<RoleDto> Roles { get; set; } = new();

    public static UserDto FromUser(User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            CurrentProfileId = user.CurrentProfileId,
            DefaultProfileId = user.DefaultProfileId,
            Roles = user.Roles?.Select(RoleDto.FromRole).ToList() ?? new()
        };
    }
}
