using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.UpdateNotice;

public class UpdateNoticeHandler : IRequestHandler<UpdateNoticeRequest, UpdateNoticeResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateNoticeHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdateNoticeResponse> Handle(UpdateNoticeRequest request, CancellationToken cancellationToken)
    {
        var notice = await _context.Notices.SingleAsync(n => n.DocumentId == request.DocumentId, cancellationToken);
        notice.Name = request.Name;
        notice.Body = request.Body;
        notice.DigitalAssetId = request.DigitalAssetId;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateNoticeResponse { Notice = NoticeDto.FromNotice(notice) };
    }
}
