using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using Coop.Domain.Documents;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Commands.CreateByLaw;

public class CreateByLawHandler : IRequestHandler<CreateByLawRequest, CreateByLawResponse>
{
    private readonly ICoopDbContext _context;
    public CreateByLawHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateByLawResponse> Handle(CreateByLawRequest request, CancellationToken cancellationToken)
    {
        var e = new ByLaw { Name = request.Name, DigitalAssetId = request.DigitalAssetId };
        _context.ByLaws.Add(e);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateByLawResponse { ByLaw = ByLawDto.FromByLaw(e) };
    }
}
