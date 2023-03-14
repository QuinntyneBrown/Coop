// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Document).NotNull();
        RuleFor(request => request.Document).SetValidator(new DocumentValidator());
    }
}
public class UpdateDocumentRequest : IRequest<UpdateDocumentResponse>
{
    public DocumentDto Document { get; set; }
}
public class UpdateDocumentResponse : ResponseBase
{
    public DocumentDto Document { get; set; }
}
public class UpdateDocumentHandler : IRequestHandler<UpdateDocumentRequest, UpdateDocumentResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateDocumentHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateDocumentResponse> Handle(UpdateDocumentRequest request, CancellationToken cancellationToken)
    {
        var document = await _context.Documents.SingleAsync(x => x.DocumentId == request.Document.DocumentId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateDocumentResponse()
        {
            Document = document.ToDto()
        };
    }
}

