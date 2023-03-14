using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveByLawRequest : IRequest<RemoveByLawResponse>
{
    public Guid ByLawId { get; set; }
}
public class RemoveByLawResponse : ResponseBase
{
    public ByLawDto ByLaw { get; set; }
}
public class RemoveByLawHandler : IRequestHandler<RemoveByLawRequest, RemoveByLawResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveByLawHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveByLawResponse> Handle(RemoveByLawRequest request, CancellationToken cancellationToken)
    {
        var byLaw = await _context.ByLaws.SingleAsync(x => x.ByLawId == request.ByLawId);
        _context.ByLaws.Remove(byLaw);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveByLawResponse()
        {
            ByLaw = byLaw.ToDto()
        };
    }
}
