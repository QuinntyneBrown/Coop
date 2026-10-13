using Coop.Application.CMS.Dtos;
using Coop.Application.Common.Interfaces;
using Coop.Domain.CMS;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Pages.Commands.UpdatePage;

public class UpdatePageHandler : IRequestHandler<UpdatePageRequest, UpdatePageResponse>
{
    private readonly ICoopDbContext _context;
    public UpdatePageHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdatePageResponse> Handle(UpdatePageRequest request, CancellationToken cancellationToken)
    {
        var page = await _context.Pages
            .SingleAsync(p => p.PageId == request.PageId && !p.IsDeleted, cancellationToken);

        var slug = Page.SlugFrom(request.Title);
        var taken = await _context.Pages
            .AnyAsync(p => p.Slug == slug && !p.IsDeleted && p.PageId != page.PageId, cancellationToken);

        if (taken)
            throw new ValidationException(new[] { new ValidationFailure(nameof(request.Title), PageRules.DuplicateTitleMessage) });

        page.Update(request.Title, request.HeroImageUrl, request.Body);
        await _context.SaveChangesAsync(cancellationToken);

        return new UpdatePageResponse { Page = PageDto.FromPage(page) };
    }
}
