using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

public class RemoveJsonContentRequest : IRequest<RemoveJsonContentResponse>
{
    public Guid JsonContentId { get; set; }
}
public class RemoveJsonContentResponse : ResponseBase
{
    public JsonContentDto JsonContent { get; set; }
}
public class RemoveJsonContentHandler : IRequestHandler<RemoveJsonContentRequest, RemoveJsonContentResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveJsonContentHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveJsonContentResponse> Handle(RemoveJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = await _context.JsonContents.SingleAsync(x => x.JsonContentId == request.JsonContentId);
        _context.JsonContents.Remove(jsonContent);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveJsonContentResponse()
        {
            JsonContent = jsonContent.ToDto()
        };
    }
}
