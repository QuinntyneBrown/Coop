// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;
using System;
using Microsoft.AspNetCore.Http;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
    }
}
public class CreateByLawRequest : IRequest<CreateByLawResponse>
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; }
}
public class CreateByLawResponse : ResponseBase
{
    public ByLawDto ByLaw { get; set; }
}
public class CreateByLawHandler : IRequestHandler<CreateByLawRequest, CreateByLawResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CreateByLawHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<CreateByLawResponse> Handle(CreateByLawRequest request, CancellationToken cancellationToken)
    {
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        var user = await _context.Users.FindAsync(userId);
        var @event = new Domain.DomainEvents.CreateDocument(Guid.NewGuid(), request.Name, request.DigitalAssetId, user.CurrentProfileId);
        var byLaw = new ByLaw(@event);
        _context.ByLaws.Add(byLaw);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            ByLaw = byLaw.ToDto()
        };
    }
}

