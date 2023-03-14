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

public class GetThemesRequest : IRequest<GetThemesResponse> { }
public class GetThemesResponse : ResponseBase
{
    public List<ThemeDto> Themes { get; set; }
}
public class GetThemesHandler : IRequestHandler<GetThemesRequest, GetThemesResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemesHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetThemesResponse> Handle(GetThemesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Themes = await _context.Themes.Select(x => x.ToDto()).ToListAsync()
        };
    }
}
