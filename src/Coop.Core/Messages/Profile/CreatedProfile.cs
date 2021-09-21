using MediatR;
using System;

namespace Coop.Core.Messages
{
    public class CreatedProfile: INotification
    {
        public Guid UserId { get; set; }
        public Guid ProfileId { get; set; }
    }
}
