using Coop.Api.DomainEvents;
using System;
using System.Collections.Generic;

namespace Coop.Api.Models
{
    public class Notice
    {
        public Guid NoticeId { get; private set; }
        public string Name { get; private set; }
        public string Body { get; private set; }
        public Guid DigitialAssetId { get; private set; }
        public List<NoticeDomainEvent> Events { get; private set; } = new();

        public Notice(string name, string body, Guid createdByUserId)
        {
            Name = name;
            Body = body;

            Events.Add(new NoticeCreatedEvent(name, body, createdByUserId));
        }

        private Notice()
        {

        }

        public void Update()
        {

        }
    }
}
