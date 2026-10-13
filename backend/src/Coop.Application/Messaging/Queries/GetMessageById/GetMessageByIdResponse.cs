using Coop.Application.Messaging.Dtos;

namespace Coop.Application.Messaging.Queries.GetMessageById;

public class GetMessageByIdResponse
{
    public MessageDto Message { get; set; } = default!;
}
