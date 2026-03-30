using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.UpdateByLaw;

public class UpdateByLawHandler : IRequestHandler<UpdateByLawRequest, UpdateByLawResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateByLawHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdateByLawResponse> Handle(UpdateByLawRequest request, CancellationToken cancellationToken)
    {
        var e = await _context.ByLaws.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        e.Name = request.Name; e.DigitalAssetId = request.DigitalAssetId;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateByLawResponse { ByLaw = ByLawDto.FromByLaw(e) };
    }
}
