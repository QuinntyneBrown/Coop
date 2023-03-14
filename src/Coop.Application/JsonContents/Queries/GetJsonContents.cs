// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

public class GetJsonContentsRequest : IRequest<GetJsonContentsResponse> { }
public class GetJsonContentsResponse : ResponseBase
{
    public List<JsonContentDto> JsonContents { get; set; }
}
public class GetJsonContentsHandler : IRequestHandler<GetJsonContentsRequest, GetJsonContentsResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetJsonContentsResponse> Handle(GetJsonContentsRequest request, CancellationToken cancellationToken)
    {
        var json = _context.JsonContents.ToList();
        return new()
        {
            JsonContents = json.Select(x => x.ToDto()).ToList()
        };
    }
}

