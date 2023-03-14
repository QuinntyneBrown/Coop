using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.ByLaw).NotNull();
        RuleFor(request => request.ByLaw).SetValidator(new ByLawValidator());
    }
}
public class UpdateByLawRequest : IRequest<UpdateByLawResponse>
{
    public ByLawDto ByLaw { get; set; }
}
public class UpdateByLawResponse : ResponseBase
{
    public ByLawDto ByLaw { get; set; }
}
public class UpdateByLawHandler : IRequestHandler<UpdateByLawRequest, UpdateByLawResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateByLawHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateByLawResponse> Handle(UpdateByLawRequest request, CancellationToken cancellationToken)
    {
        var byLaw = await _context.ByLaws.SingleAsync(x => x.ByLawId == request.ByLaw.ByLawId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateByLawResponse()
        {
            ByLaw = byLaw.ToDto()
        };
    }
}
