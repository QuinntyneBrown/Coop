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

public class GetNoticesRequest : IRequest<GetNoticesResponse> { }
public class GetNoticesResponse : ResponseBase
{
    public List<NoticeDto> Notices { get; set; }
}
public class GetNoticesHandler : IRequestHandler<GetNoticesRequest, GetNoticesResponse>
{
    private readonly ICoopDbContext _context;
    public GetNoticesHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetNoticesResponse> Handle(GetNoticesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Notices = await _context.Notices.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

