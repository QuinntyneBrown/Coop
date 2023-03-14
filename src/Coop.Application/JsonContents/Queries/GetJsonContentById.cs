// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.JsonContents;

public class GetJsonContentByIdRequest : IRequest<GetJsonContentByIdResponse>
{
    public Guid JsonContentId { get; set; }
}
public class GetJsonContentByIdResponse : ResponseBase
{
    public JsonContentDto JsonContent { get; set; }
}
public class GetJsonContentByIdHandler : IRequestHandler<GetJsonContentByIdRequest, GetJsonContentByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetJsonContentByIdResponse> Handle(GetJsonContentByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            JsonContent = (await _context.JsonContents.SingleOrDefaultAsync(x => x.JsonContentId == request.JsonContentId)).ToDto()
        };
    }
}

