using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetDocuments;

public class GetDocumentsHandler : IRequestHandler<GetDocumentsRequest, GetDocumentsResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetDocumentsHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetDocumentsResponse> Handle(GetDocumentsRequest request, CancellationToken cancellationToken)
    {
        // Drafts are the office's work in progress; a member reads published documents only (L2-REQ-106).
        var office = await CallerAccess.HoldsWriteAsync(_authorization, _user, Constants.Aggregates.Notice);
        var d = await _context.Documents.Where(x => !x.IsDeleted && (office || x.Published)).ToListAsync(cancellationToken);
        return new GetDocumentsResponse { Documents = d.Select(DocumentDto.FromDocument).ToList() };
    }
}
