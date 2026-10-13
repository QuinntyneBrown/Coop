using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.RemoveByLaw;

public class RemoveByLawHandler : IRequestHandler<RemoveByLawRequest, RemoveByLawResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveByLawHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveByLawResponse> Handle(RemoveByLawRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.ByLaws.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        e.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveByLawResponse { ByLaw = ByLawDto.FromByLaw(e) };
    }
}
