using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetByLawById;

public class GetByLawByIdHandler : IRequestHandler<GetByLawByIdRequest, GetByLawByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetByLawByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetByLawByIdResponse> Handle(GetByLawByIdRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.ByLaws.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        return new GetByLawByIdResponse { ByLaw = ByLawDto.FromByLaw(e) };
    }
}
