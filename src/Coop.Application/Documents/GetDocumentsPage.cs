using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetDocumentsPageRequest : IRequest<GetDocumentsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetDocumentsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<DocumentDto> Entities { get; set; }
}
public class GetDocumentsPageHandler : IRequestHandler<GetDocumentsPageRequest, GetDocumentsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetDocumentsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetDocumentsPageResponse> Handle(GetDocumentsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from document in _context.Documents
                    select document;
        var length = await _context.Documents.CountAsync();
        var documents = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = documents
        };
    }
}
