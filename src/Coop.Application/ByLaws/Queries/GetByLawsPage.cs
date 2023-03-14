using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetByLawsPageRequest : IRequest<GetByLawsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetByLawsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<ByLawDto> Entities { get; set; }
}
public class GetByLawsPageHandler : IRequestHandler<GetByLawsPageRequest, GetByLawsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetByLawsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetByLawsPageResponse> Handle(GetByLawsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from byLaw in _context.ByLaws
                    select byLaw;
        var length = await _context.ByLaws.CountAsync();
        var byLaws = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = byLaws
        };
    }
}
