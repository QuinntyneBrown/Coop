using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMessageByIdRequest : IRequest<GetMessageByIdResponse>
{
    public Guid MessageId { get; set; }
}
public class GetMessageByIdResponse : ResponseBase
{
    public MessageDto Message { get; set; }
}
public class GetMessageByIdHandler : IRequestHandler<GetMessageByIdRequest, GetMessageByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetMessageByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMessageByIdResponse> Handle(GetMessageByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Message = (await _context.Messages.SingleOrDefaultAsync(x => x.MessageId == request.MessageId)).ToDto()
        };
    }
}
