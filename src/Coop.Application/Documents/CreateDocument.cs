// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Document).NotNull();
        RuleFor(request => request.Document).SetValidator(new DocumentValidator());
    }
}
public class CreateDocumentRequest : IRequest<CreateDocumentResponse>
{
    public DocumentDto Document { get; set; }
}
public class CreateDocumentResponse : ResponseBase
{
    public DocumentDto Document { get; set; }
}
public class CreateDocumentHandler : IRequestHandler<CreateDocumentRequest, CreateDocumentResponse>
{
    private readonly ICoopDbContext _context;
    public CreateDocumentHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateDocumentResponse> Handle(CreateDocumentRequest request, CancellationToken cancellationToken)
    {
        var document = new Document(default);
        _context.Documents.Add(document);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateDocumentResponse()
        {
            Document = document.ToDto()
        };
    }
}

