using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetThemeByProfileIdRequest : IRequest<GetThemeByProfileIdResponse>
{
    public Guid ProfileId { get; set; }
}
public class GetThemeByProfileIdResponse : ResponseBase
{
    public ThemeDto Theme { get; set; }
}
public class GetThemeByProfileIdHandler : IRequestHandler<GetThemeByProfileIdRequest, GetThemeByProfileIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemeByProfileIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetThemeByProfileIdResponse> Handle(GetThemeByProfileIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Theme = (await _context.Themes.SingleOrDefaultAsync(x => x.ProfileId == request.ProfileId)).ToDto()
        };
    }
}
