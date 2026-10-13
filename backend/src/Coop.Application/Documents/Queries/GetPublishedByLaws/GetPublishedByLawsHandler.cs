using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetPublishedByLaws;

public class GetPublishedByLawsHandler : IRequestHandler<GetPublishedByLawsRequest, GetPublishedByLawsResponse>
{
    private readonly ICoopDbContext _context;
    public GetPublishedByLawsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetPublishedByLawsResponse> Handle(GetPublishedByLawsRequest request, CancellationToken cancellationToken)
    {
        var es = await _context.ByLaws.Where(x => x.Published && !x.IsDeleted).ToListAsync(cancellationToken);
        return new GetPublishedByLawsResponse { ByLaws = es.Select(ByLawDto.FromByLaw).ToList() };
    }
}
