using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Content.Queries.GetJsonContents;

public class GetJsonContentsHandler : IRequestHandler<GetJsonContentsRequest, GetJsonContentsResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetJsonContentsResponse> Handle(GetJsonContentsRequest request, CancellationToken cancellationToken)
    {
        var jcs = await _context.JsonContents.Where(x => !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetJsonContentsResponse { JsonContents = jcs.Select(JsonContentDto.FromJsonContent).ToList() };
    }
}
