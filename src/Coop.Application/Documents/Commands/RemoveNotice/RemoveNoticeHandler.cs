using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.RemoveNotice;

public class RemoveNoticeHandler : IRequestHandler<RemoveNoticeRequest, RemoveNoticeResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveNoticeHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveNoticeResponse> Handle(RemoveNoticeRequest request, CancellationToken cancellationToken)
    {
        var notice = await _context.Notices.SingleAsync(n => n.DocumentId == request.DocumentId, cancellationToken);
        notice.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveNoticeResponse { Notice = NoticeDto.FromNotice(notice) };
    }
}
