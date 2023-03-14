// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.OnCall).NotNull();
        RuleFor(request => request.OnCall).SetValidator(new OnCallValidator());
    }
}
public class UpdateOnCallRequest : IRequest<UpdateOnCallResponse>
{
    public OnCallDto OnCall { get; set; }
}
public class UpdateOnCallResponse : ResponseBase
{
    public OnCallDto OnCall { get; set; }
}
public class UpdateOnCallHandler : IRequestHandler<UpdateOnCallRequest, UpdateOnCallResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateOnCallHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateOnCallResponse> Handle(UpdateOnCallRequest request, CancellationToken cancellationToken)
    {
        var onCall = await _context.OnCalls.SingleAsync(x => x.OnCallId == request.OnCall.OnCallId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateOnCallResponse()
        {
            OnCall = onCall.ToDto()
        };
    }
}

