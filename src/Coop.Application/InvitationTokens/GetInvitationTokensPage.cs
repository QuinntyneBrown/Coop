// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetInvitationTokensPageRequest : IRequest<GetInvitationTokensPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetInvitationTokensPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<InvitationTokenDto> Entities { get; set; }
}
public class GetInvitationTokensPageHandler : IRequestHandler<GetInvitationTokensPageRequest, GetInvitationTokensPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetInvitationTokensPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetInvitationTokensPageResponse> Handle(GetInvitationTokensPageRequest request, CancellationToken cancellationToken)
    {
        var query = from invitationToken in _context.InvitationTokens
                    select invitationToken;
        var length = await _context.InvitationTokens.CountAsync();
        var invitationTokens = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = invitationTokens
        };
    }
}

