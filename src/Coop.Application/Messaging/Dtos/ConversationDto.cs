using Coop.Domain.Messaging;

namespace Coop.Application.Messaging.Dtos;

public class ConversationDto
{
    public Guid ConversationId { get; set; }
    public DateTime CreatedOn { get; set; }
    public List<MessageDto> Messages { get; set; } = new();
    public List<Guid> ProfileIds { get; set; } = new();

    public static ConversationDto FromConversation(Conversation c)
    {
        return new ConversationDto
        {
            ConversationId = c.ConversationId,
            CreatedOn = c.CreatedOn,
            Messages = c.Messages?.Select(MessageDto.FromMessage).ToList() ?? new(),
            ProfileIds = c.Profiles?.Select(p => p.ProfileId).ToList() ?? new()
        };
    }
}
