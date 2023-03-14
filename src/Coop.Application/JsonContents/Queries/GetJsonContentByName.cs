// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

public class GetJsonContentByNameRequest : IRequest<GetJsonContentByNameResponse>
{
    public string? Name { get; set; }
}
public class GetJsonContentByNameResponse : ResponseBase
{
    public JsonContentDto? JsonContent { get; set; }
}
public class GetJsonContentByNameHandler : IRequestHandler<GetJsonContentByNameRequest, GetJsonContentByNameResponse>
{
    private readonly ICoopDbContext _context;
    public GetJsonContentByNameHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetJsonContentByNameResponse> Handle(GetJsonContentByNameRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            JsonContent = (await _context.JsonContents.SingleOrDefaultAsync(x => x.Name == request.Name)).ToDto()
        };
    }
}

