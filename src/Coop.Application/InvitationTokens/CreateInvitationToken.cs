// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class CreateInvitationTokenValidator : AbstractValidator<CreateInvitationTokenRequest>
{
    public CreateInvitationTokenValidator()
    {
        RuleFor(request => request.InvitationToken).NotNull();
        RuleFor(request => request.InvitationToken).SetValidator(new InvitationTokenValidator());
    }
}
public class CreateInvitationTokenRequest : IRequest<CreateInvitationTokenResponse>
{
    public InvitationTokenDto InvitationToken { get; set; }
}
public class CreateInvitationTokenResponse : ResponseBase
{
    public InvitationTokenDto InvitationToken { get; set; }
}
public class CreateInvitationTokenHandler : IRequestHandler<CreateInvitationTokenRequest, CreateInvitationTokenResponse>
{
    private readonly ICoopDbContext _context;
    public CreateInvitationTokenHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateInvitationTokenResponse> Handle(CreateInvitationTokenRequest request, CancellationToken cancellationToken)
    {
        var invitationToken = new InvitationToken(request.InvitationToken.Value, request.InvitationToken.Expiry);
        _context.InvitationTokens.Add(invitationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            InvitationToken = invitationToken.ToDto()
        };
    }
}

