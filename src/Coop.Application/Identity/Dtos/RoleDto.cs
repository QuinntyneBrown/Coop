using Coop.Domain.Identity;

namespace Coop.Application.Identity.Dtos;

public class RoleDto
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<PrivilegeDto> Privileges { get; set; } = new();

    public static RoleDto FromRole(Role role)
    {
        return new RoleDto
        {
            RoleId = role.RoleId,
            Name = role.Name,
            Privileges = role.Privileges?.Select(PrivilegeDto.FromPrivilege).ToList() ?? new()
        };
    }
}
