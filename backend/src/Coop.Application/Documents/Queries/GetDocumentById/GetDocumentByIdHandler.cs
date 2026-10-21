using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Documents.Dtos;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Documents.Queries.GetDocumentById;

public class GetDocumentByIdHandler : IRequestHandler<GetDocumentByIdRequest, GetDocumentByIdResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetDocumentByIdHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetDocumentByIdResponse> Handle(GetDocumentByIdRequest request, CancellationToken cancellationToken)
    {
        var d = await _context.Documents.SingleAsync(x => x.DocumentId == request.DocumentId, cancellationToken);
        if (!d.Published && !await CallerAccess.HoldsWriteAsync(_authorization, _user, Constants.Aggregates.Notice))
            throw new UnauthorizedAccessException("Access denied.");
        return new GetDocumentByIdResponse { Document = DocumentDto.FromDocument(d) };
    }
}
