using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentsPage;

public class GetJsonContentsPageHandler : IRequestHandler<GetJsonContentsPageRequest, GetJsonContentsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentsPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetJsonContentsPageResponse> Handle(GetJsonContentsPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.JsonContents.Where(x => !x.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var jcs = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetJsonContentsPageResponse { JsonContents = jcs.Select(JsonContentDto.FromJsonContent).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
