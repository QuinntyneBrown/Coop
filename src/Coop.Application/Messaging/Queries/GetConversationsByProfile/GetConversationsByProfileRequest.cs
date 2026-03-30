using MediatR;

namespace Coop.Application.Messaging.Queries.GetConversationsByProfile;

public class GetConversationsByProfileRequest : IRequest<GetConversationsByProfileResponse>
{
    public Guid ProfileId { get; set; }
}
