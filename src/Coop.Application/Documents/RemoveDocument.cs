// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.DomainEvents.Document;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class RemoveDocumentRequest : IRequest<RemoveDocumentResponse>
{
    public Guid DocumentId { get; set; }
}
public class RemoveDocumentResponse : ResponseBase
{
    public DocumentDto Document { get; set; }
}
public class RemoveDocumentHandler : IRequestHandler<RemoveDocumentRequest, RemoveDocumentResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveDocumentHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveDocumentResponse> Handle(RemoveDocumentRequest request, CancellationToken cancellationToken)
    {
        var document = await _context.Documents.SingleAsync(x => x.DocumentId == request.DocumentId);
        document.Apply(new DeleteDocument());
        _context.Documents.Remove(document);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Document = document.ToDto()
        };
    }
}

