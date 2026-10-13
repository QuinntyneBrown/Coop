using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Pages.Commands.RemovePage;

public class RemovePageHandler : IRequestHandler<RemovePageRequest, RemovePageResponse>
{
    private readonly ICoopDbContext _context;
    public RemovePageHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemovePageResponse> Handle(RemovePageRequest request, CancellationToken cancellationToken)
    {
        var page = await _context.Pages
            .SingleAsync(p => p.PageId == request.PageId && !p.IsDeleted, cancellationToken);
        page.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemovePageResponse { Page = PageDto.FromPage(page) };
    }
}
