using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetOnCallByIdRequest : IRequest<GetOnCallByIdResponse>
{
    public Guid OnCallId { get; set; }
}
public class GetOnCallByIdResponse : ResponseBase
{
    public OnCallDto OnCall { get; set; }
}
public class GetOnCallByIdHandler : IRequestHandler<GetOnCallByIdRequest, GetOnCallByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetOnCallByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetOnCallByIdResponse> Handle(GetOnCallByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            OnCall = (await _context.OnCalls.SingleOrDefaultAsync(x => x.OnCallId == request.OnCallId)).ToDto()
        };
    }
}
