using System;
using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class ConversationExtensions
    {
        public static ConversationDto ToDto(this Conversation conversation)
        {
            return new()
            {
                ConversationId = conversation.ConversationId
            };
        }

    }
}
