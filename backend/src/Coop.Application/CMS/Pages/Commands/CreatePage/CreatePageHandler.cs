using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Pages.Commands.CreatePage;

/// <summary>
/// Creates a page, or returns the page that already has the title's slug so a
/// retried create never duplicates (ADR 0002).
/// </summary>
public class CreatePageHandler : IRequestHandler<CreatePageRequest, CreatePageResponse>
{
    private readonly ICoopDbContext _context;
    public CreatePageHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreatePageResponse> Handle(CreatePageRequest request, CancellationToken cancellationToken)
    {
        var slug = Page.SlugFrom(request.Title);
        var existing = await _context.Pages
            .FirstOrDefaultAsync(p => p.Slug == slug && !p.IsDeleted, cancellationToken);

        if (existing != null)
            return new CreatePageResponse { Page = PageDto.FromPage(existing) };

        var page = new Page();
        page.Update(request.Title, request.HeroImageUrl, request.HeroImageAlt, PageSections.Serialize(PageSections.From(request.Sections, request.Body), request.Fr), request.Published);
        _context.Pages.Add(page);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreatePageResponse { Page = PageDto.FromPage(page) };
    }
}
