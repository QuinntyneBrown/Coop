using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class ByLawExtensions
    {
        public static ByLawDto ToDto(this ByLaw byLaw)
        {
            return new()
            {
                ByLawId = byLaw.ByLawId
            };
        }

    }
}
