using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetByLaws;

public class GetByLawsHandler : IRequestHandler<GetByLawsRequest, GetByLawsResponse>
{
    private readonly ICoopDbContext _context;
    public GetByLawsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetByLawsResponse> Handle(GetByLawsRequest request, CancellationToken cancellationToken)
    {
        var es = await _context.ByLaws.Where(x => !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetByLawsResponse { ByLaws = es.Select(ByLawDto.FromByLaw).ToList() };
    }
}
