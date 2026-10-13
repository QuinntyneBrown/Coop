using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentByName;

public class GetJsonContentByNameHandler : IRequestHandler<GetJsonContentByNameRequest, GetJsonContentByNameResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentByNameHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetJsonContentByNameResponse> Handle(GetJsonContentByNameRequest request, CancellationToken cancellationToken)
    {
        var jc = await _context.JsonContents.FirstOrDefaultAsync(x => x.Name == request.Name && !x.IsDeleted, cancellationToken);
        return new GetJsonContentByNameResponse { JsonContent = jc != null ? JsonContentDto.FromJsonContent(jc) : null };
    }
}
