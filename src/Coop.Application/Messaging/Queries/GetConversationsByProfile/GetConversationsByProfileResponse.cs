using Coop.Application.Messaging.Dtos;

namespace Coop.Application.Messaging.Queries.GetConversationsByProfile;

public class GetConversationsByProfileResponse
{
    public List<ConversationDto> Conversations { get; set; } = new();
}
