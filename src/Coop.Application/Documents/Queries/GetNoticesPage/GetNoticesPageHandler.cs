using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetNoticesPage;

public class GetNoticesPageHandler : IRequestHandler<GetNoticesPageRequest, GetNoticesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetNoticesPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetNoticesPageResponse> Handle(GetNoticesPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.Notices.Where(x => !x.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var es = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetNoticesPageResponse { Notices = es.Select(NoticeDto.FromNotice).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
