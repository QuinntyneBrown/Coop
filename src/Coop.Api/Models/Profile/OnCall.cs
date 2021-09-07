using System;

namespace Coop.Api.Models
{
    public class OnCall : Profile
    {
        public Guid OnCallId { get; set; }

        public OnCall(Guid userId, string firstname, string lastname)
            : base(ProfileType.OnCall, userId, firstname, lastname)
        {
        }

        private OnCall()
        {

        }
    }
}
