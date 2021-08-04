using Coop.Api.Models;
using System.Linq;

namespace Coop.Api.Features
{
    public static class UserExtensions
    {
        public static UserDto ToDto(this User user)
        {
            return new()
            {
                UserId = user.UserId,
                Username = user.Username,
                Roles = user.Roles.Select(x => x.ToDto()).ToList()
            };
        }

    }
}
