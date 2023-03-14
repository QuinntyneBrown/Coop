using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetByLawsRequest : IRequest<GetByLawsResponse> { }
public class GetByLawsResponse : ResponseBase
{
    public List<ByLawDto> ByLaws { get; set; }
}
public class GetByLawsHandler : IRequestHandler<GetByLawsRequest, GetByLawsResponse>
{
    private readonly ICoopDbContext _context;
    public GetByLawsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetByLawsResponse> Handle(GetByLawsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            ByLaws = await _context.ByLaws.Select(x => x.ToDto()).ToListAsync()
        };
    }
}
