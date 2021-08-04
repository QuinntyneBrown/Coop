using System;

namespace Coop.Api.DomainEvents
{
    public class NoticeCreatedEvent : NoticeDomainEvent
    {
        public string Name { get; private set; }
        public string Body { get; private set; }
        public Guid CreatedByUserId { get; private set; }
        public NoticeCreatedEvent(string name, string body, Guid createdByUserId)
        {
            Name = name;
            Body = body;
            CreatedByUserId = createdByUserId;
        }

        private NoticeCreatedEvent()
        {

        }
    }
}
