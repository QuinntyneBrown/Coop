using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Content.Commands.RemoveJsonContent;

public class RemoveJsonContentHandler : IRequestHandler<RemoveJsonContentRequest, RemoveJsonContentResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveJsonContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveJsonContentResponse> Handle(RemoveJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jc = await _context.JsonContents.SingleAsync(x => x.JsonContentId == request.JsonContentId, cancellationToken);
        jc.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveJsonContentResponse { JsonContent = JsonContentDto.FromJsonContent(jc) };
    }
}
