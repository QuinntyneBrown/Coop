using Coop.Application.Common.Interfaces;
using Coop.Application.CMS.Dtos;
using Coop.Domain.CMS;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.CMS.Content.Commands.CreateJsonContent;

public class CreateJsonContentHandler : IRequestHandler<CreateJsonContentRequest, CreateJsonContentResponse>
{
    private readonly ICoopDbContext _context;
    public CreateJsonContentHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateJsonContentResponse> Handle(CreateJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jc = new JsonContent { Name = request.Name, Json = request.Json };
        _context.JsonContents.Add(jc);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateJsonContentResponse { JsonContent = JsonContentDto.FromJsonContent(jc) };
    }
}
