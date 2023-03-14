using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMessagesRequest : IRequest<GetMessagesResponse> { }
public class GetMessagesResponse : ResponseBase
{
    public List<MessageDto> Messages { get; set; }
}
public class GetMessagesHandler : IRequestHandler<GetMessagesRequest, GetMessagesResponse>
{
    private readonly ICoopDbContext _context;
    public GetMessagesHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMessagesResponse> Handle(GetMessagesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Messages = await _context.Messages.Select(x => x.ToDto()).ToListAsync()
        };
    }
}
