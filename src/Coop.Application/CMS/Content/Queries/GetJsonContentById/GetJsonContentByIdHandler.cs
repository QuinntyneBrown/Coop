using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentById;

public class GetJsonContentByIdHandler : IRequestHandler<GetJsonContentByIdRequest, GetJsonContentByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetJsonContentByIdResponse> Handle(GetJsonContentByIdRequest request, CancellationToken cancellationToken)
    {
        var jc = await _context.JsonContents.SingleAsync(x => x.JsonContentId == request.JsonContentId, cancellationToken);
        return new GetJsonContentByIdResponse { JsonContent = JsonContentDto.FromJsonContent(jc) };
    }
}
