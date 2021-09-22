using System;

namespace Coop.Core.DomainEvents
{
    public class CreatedNotice : DomainEventBase
    {
        public string Name { get; private set; }
        public string Body { get; private set; }
        public Guid NoticeId { get; private set; }
        public Guid CreatedByUserId { get; private set; }
        public CreatedNotice(Guid noticeId, string name, string body, Guid createdByUserId)
        {
            NoticeId = noticeId;
            Name = name;
            Body = body;
            CreatedByUserId = createdByUserId;
        }

        private CreatedNotice()
        {

        }
    }
}
