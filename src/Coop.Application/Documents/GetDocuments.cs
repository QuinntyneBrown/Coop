// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetDocumentsRequest : IRequest<GetDocumentsResponse> { }
public class GetDocumentsResponse : ResponseBase
{
    public List<DocumentDto> Documents { get; set; }
}
public class GetDocumentsHandler : IRequestHandler<GetDocumentsRequest, GetDocumentsResponse>
{
    private readonly ICoopDbContext _context;
    public GetDocumentsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetDocumentsResponse> Handle(GetDocumentsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Documents = await _context.Documents.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

