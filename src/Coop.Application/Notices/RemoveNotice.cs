using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveNoticeRequest : IRequest<RemoveNoticeResponse>
{
    public Guid NoticeId { get; set; }
}
public class RemoveNoticeResponse : ResponseBase
{
    public NoticeDto Notice { get; set; }
}
public class RemoveNoticeHandler : IRequestHandler<RemoveNoticeRequest, RemoveNoticeResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveNoticeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveNoticeResponse> Handle(RemoveNoticeRequest request, CancellationToken cancellationToken)
    {
        var notice = await _context.Notices.SingleAsync(x => x.NoticeId == request.NoticeId);
        _context.Notices.Remove(notice);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveNoticeResponse()
        {
            Notice = notice.ToDto()
        };
    }
}
