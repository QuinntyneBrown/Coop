using System;
using System.Collections.Generic;

namespace Coop.Api.Models
{
    public class Conversation
    {
        public Guid ConversationId { get; set; }
        public List<Profile> Profiles { get; private set; } = new();
        public List<Message> Messages { get; private set; } = new();
        public DateTime Created { get; private set; } = DateTime.UtcNow;
    }
}
