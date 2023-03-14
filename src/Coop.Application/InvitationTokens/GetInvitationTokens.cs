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

public class GetInvitationTokensRequest : IRequest<GetInvitationTokensResponse> { }
public class GetInvitationTokensResponse : ResponseBase
{
    public List<InvitationTokenDto> InvitationTokens { get; set; }
}
public class GetInvitationTokensHandler : IRequestHandler<GetInvitationTokensRequest, GetInvitationTokensResponse>
{
    private readonly ICoopDbContext _context;
    public GetInvitationTokensHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetInvitationTokensResponse> Handle(GetInvitationTokensRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            InvitationTokens = await _context.InvitationTokens.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

