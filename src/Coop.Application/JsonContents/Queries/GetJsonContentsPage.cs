// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

public class GetJsonContentsPageRequest : IRequest<GetJsonContentsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetJsonContentsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<JsonContentDto> Entities { get; set; }
}
public class GetJsonContentsPageHandler : IRequestHandler<GetJsonContentsPageRequest, GetJsonContentsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetJsonContentsPageResponse> Handle(GetJsonContentsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from jsonContent in _context.JsonContents
                    select jsonContent;
        var length = await _context.JsonContents.CountAsync();
        var jsonContents = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = jsonContents
        };
    }
}

