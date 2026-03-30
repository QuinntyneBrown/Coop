using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Content.Commands.UpdateJsonContent;

public class UpdateJsonContentHandler : IRequestHandler<UpdateJsonContentRequest, UpdateJsonContentResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateJsonContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdateJsonContentResponse> Handle(UpdateJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jc = await _context.JsonContents.SingleAsync(x => x.JsonContentId == request.JsonContentId, cancellationToken);
        jc.Name = request.Name;
        jc.Json = request.Json;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateJsonContentResponse { JsonContent = JsonContentDto.FromJsonContent(jc) };
    }
}
