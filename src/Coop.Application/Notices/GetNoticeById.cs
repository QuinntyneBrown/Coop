using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetNoticeByIdRequest : IRequest<GetNoticeByIdResponse>
{
    public Guid NoticeId { get; set; }
}
public class GetNoticeByIdResponse : ResponseBase
{
    public NoticeDto Notice { get; set; }
}
public class GetNoticeByIdHandler : IRequestHandler<GetNoticeByIdRequest, GetNoticeByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetNoticeByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetNoticeByIdResponse> Handle(GetNoticeByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Notice = (await _context.Notices.SingleOrDefaultAsync(x => x.NoticeId == request.NoticeId)).ToDto()
        };
    }
}
