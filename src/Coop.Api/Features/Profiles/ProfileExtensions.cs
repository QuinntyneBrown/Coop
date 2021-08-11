using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class ProfileExtensions
    {
        public static ProfileDto ToDto(this Profile profile)
        {
            return new ()
            {
                ProfileId = profile.ProfileId
            };
        }
        
    }
}
