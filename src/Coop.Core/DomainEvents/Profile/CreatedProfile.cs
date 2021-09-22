using MediatR;
using System;

namespace Coop.Core.DomainEvents
{
    public class CreatedProfile : INotification
    {
        public Guid UserId { get; set; }
        public Guid ProfileId { get; set; }
    }
}
