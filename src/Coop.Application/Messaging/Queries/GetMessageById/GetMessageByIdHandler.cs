using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetMessageById;

public class GetMessageByIdHandler : IRequestHandler<GetMessageByIdRequest, GetMessageByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetMessageByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetMessageByIdResponse> Handle(GetMessageByIdRequest request, CancellationToken cancellationToken)
    {
        var m = await _context.Messages.SingleAsync(m => m.MessageId == request.MessageId, cancellationToken);
        return new GetMessageByIdResponse { Message = MessageDto.FromMessage(m) };
    }
}
