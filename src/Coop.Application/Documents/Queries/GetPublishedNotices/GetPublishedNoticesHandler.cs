using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetPublishedNotices;

public class GetPublishedNoticesHandler : IRequestHandler<GetPublishedNoticesRequest, GetPublishedNoticesResponse>
{
    private readonly ICoopDbContext _context;
    public GetPublishedNoticesHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetPublishedNoticesResponse> Handle(GetPublishedNoticesRequest request, CancellationToken cancellationToken)
    {
        var es = await _context.Notices.Where(x => x.Published && !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetPublishedNoticesResponse { Notices = es.Select(NoticeDto.FromNotice).ToList() };
    }
}
