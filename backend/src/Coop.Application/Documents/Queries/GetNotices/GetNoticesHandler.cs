using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetNotices;

public class GetNoticesHandler : IRequestHandler<GetNoticesRequest, GetNoticesResponse>
{
    private readonly ICoopDbContext _context;
    public GetNoticesHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetNoticesResponse> Handle(GetNoticesRequest request, CancellationToken cancellationToken)
    {
        var es = await _context.Notices.Where(x => !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetNoticesResponse { Notices = es.Select(NoticeDto.FromNotice).ToList() };
    }
}
