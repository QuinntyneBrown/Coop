using Coop.Domain.Entities;
using System.Linq;

namespace Coop.Application.Features
{
    public static class UserExtensions
    {
        public static UserDto ToDto(this User user)
        {
            return new()
            {
                UserId = user.UserId,
                Username = user.Username,
                Roles = user.Roles.Select(x => x.ToDto()).ToList(),
                Profiles = user.Profiles.Select(x => x.ToDto()).ToList(),
                DefaultProfileId = user.DefaultProfileId
            };
        }

    }
}
