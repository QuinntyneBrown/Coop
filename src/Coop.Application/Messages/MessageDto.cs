using System;

namespace Coop.Application.Features
{
    public class MessageDto
    {
        public Guid MessageId { get; set; }
        public Guid? ConversationId { get; set; }
        public Guid ToProfileId { get; set; }
        public Guid FromProfileId { get; set; }
        public string Body { get; set; }
        public bool Read { get; set; }
        public DateTime Created { get; set; }
    }
}
