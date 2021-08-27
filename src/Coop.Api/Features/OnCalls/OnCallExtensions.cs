using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class OnCallExtensions
    {
        public static OnCallDto ToDto(this OnCall onCall)
        {
            return new ()
            {
                OnCallId = onCall.OnCallId
            };
        }
        
    }
}
