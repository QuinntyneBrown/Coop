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

public class GetProfileByIdRequest : IRequest<GetProfileByIdResponse>
{
    public Guid ProfileId { get; set; }
}
public class GetProfileByIdResponse : ResponseBase
{
    public ProfileDto Profile { get; set; }
}
public class GetProfileByIdHandler : IRequestHandler<GetProfileByIdRequest, GetProfileByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetProfileByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetProfileByIdResponse> Handle(GetProfileByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Profile = (await _context.Profiles.SingleOrDefaultAsync(x => x.ProfileId == request.ProfileId)).ToDto()
        };
    }
}

