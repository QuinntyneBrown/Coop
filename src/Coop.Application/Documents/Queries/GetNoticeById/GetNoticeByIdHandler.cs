using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetNoticeById;

public class GetNoticeByIdHandler : IRequestHandler<GetNoticeByIdRequest, GetNoticeByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetNoticeByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetNoticeByIdResponse> Handle(GetNoticeByIdRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.Notices.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        return new GetNoticeByIdResponse { Notice = NoticeDto.FromNotice(e) };
    }
}
