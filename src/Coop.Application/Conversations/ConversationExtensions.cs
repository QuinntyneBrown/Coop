using System;
using Coop.Domain.Entities;

namespace Coop.Application.Features;

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
