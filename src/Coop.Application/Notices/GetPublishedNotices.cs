using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetPublishedNoticesRequest : IRequest<GetPublishedNoticesResponse> { }
public class GetPublishedNoticesResponse
{
    public List<NoticeDto> Notices { get; set; }
}
public class GetPublishedNoticesHandler : IRequestHandler<GetPublishedNoticesRequest, GetPublishedNoticesResponse>
{
    private readonly ICoopDbContext _context;
    public GetPublishedNoticesHandler(ICoopDbContext context)
    {
        _context = context;
    }
    public async Task<GetPublishedNoticesResponse> Handle(GetPublishedNoticesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Notices = await _context.Notices
            .Where(x => x.Published.HasValue)
            .Select(x => x.ToDto()).ToListAsync()
        };
    }
}
