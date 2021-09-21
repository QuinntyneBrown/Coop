using MediatR;
using System;

namespace Coop.Core.Messages
{
    public class CreatedUser: INotification
    {
        public Guid UserId { get; set; }
    }
}
