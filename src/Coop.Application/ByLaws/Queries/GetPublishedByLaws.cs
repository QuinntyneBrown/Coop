using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetPublishedByLawsRequest : IRequest<GetPublishedByLawsResponse> { }
public class GetPublishedByLawsResponse
{
    public List<ByLawDto> ByLaws { get; set; }
}
public class GetPublishedByLawsHandler : IRequestHandler<GetPublishedByLawsRequest, GetPublishedByLawsResponse>
{
    private readonly ICoopDbContext _context;
    public GetPublishedByLawsHandler(ICoopDbContext context)
    {
        _context = context;
    }
    public async Task<GetPublishedByLawsResponse> Handle(GetPublishedByLawsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            ByLaws = await _context.ByLaws
            .Where(x => x.Published.HasValue)
            .Select(x => x.ToDto()).ToListAsync()
        };
    }
}
