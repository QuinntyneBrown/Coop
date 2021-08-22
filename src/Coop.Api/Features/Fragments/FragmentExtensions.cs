using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class FragmentExtensions
    {
        public static FragmentDto ToDto(this Fragment fragment)
        {
            return new ()
            {
                FragmentId = fragment.FragmentId
            };
        }
        
    }
}
