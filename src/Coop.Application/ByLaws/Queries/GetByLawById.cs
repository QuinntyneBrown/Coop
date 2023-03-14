using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetByLawByIdRequest : IRequest<GetByLawByIdResponse>
{
    public Guid ByLawId { get; set; }
}
public class GetByLawByIdResponse : ResponseBase
{
    public ByLawDto ByLaw { get; set; }
}
public class GetByLawByIdHandler : IRequestHandler<GetByLawByIdRequest, GetByLawByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetByLawByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetByLawByIdResponse> Handle(GetByLawByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            ByLaw = (await _context.ByLaws.SingleOrDefaultAsync(x => x.ByLawId == request.ByLawId)).ToDto()
        };
    }
}
