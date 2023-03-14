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

public class GetStoredEventByIdRequest : IRequest<GetStoredEventByIdResponse>
{
    public Guid StoredEventId { get; set; }
}
public class GetStoredEventByIdResponse : ResponseBase
{
    public StoredEventDto StoredEvent { get; set; }
}
public class GetStoredEventByIdHandler : IRequestHandler<GetStoredEventByIdRequest, GetStoredEventByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetStoredEventByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetStoredEventByIdResponse> Handle(GetStoredEventByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            StoredEvent = (await _context.StoredEvents.SingleOrDefaultAsync(x => x.StoredEventId == request.StoredEventId)).ToDto()
        };
    }
}

