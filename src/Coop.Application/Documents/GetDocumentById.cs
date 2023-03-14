// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetDocumentByIdRequest : IRequest<GetDocumentByIdResponse>
{
    public Guid DocumentId { get; set; }
}
public class GetDocumentByIdResponse : ResponseBase
{
    public DocumentDto Document { get; set; }
}
public class GetDocumentByIdHandler : IRequestHandler<GetDocumentByIdRequest, GetDocumentByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetDocumentByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetDocumentByIdResponse> Handle(GetDocumentByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Document = (await _context.Documents.SingleOrDefaultAsync(x => x.DocumentId == request.DocumentId)).ToDto()
        };
    }
}

