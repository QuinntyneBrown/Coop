// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.EntityFrameworkCore;
using Coop.Domain;
using Coop.Domain.Enums;

namespace Coop.Application.Features;

public class CreateSupportMessageValidator : AbstractValidator<CreateSupportMessageRequest>
{
    public CreateSupportMessageValidator()
    {
        RuleFor(request => request.Message).NotNull();
        RuleFor(request => request.Message).SetValidator(new MessageValidator());
    }
}
public class CreateSupportMessageRequest : IRequest<CreateSupportMessageResponse>
{
    public MessageDto Message { get; set; }
}
public class CreateSupportMessageResponse : ResponseBase
{
    public MessageDto Message { get; set; }
}
public class CreateSupportMessageHandler : IRequestHandler<CreateSupportMessageRequest, CreateSupportMessageResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CreateSupportMessageHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<CreateSupportMessageResponse> Handle(CreateSupportMessageRequest request, CancellationToken cancellationToken)
    {
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        var user = await _context.Users.FindAsync(userId);
        var profile = await _context.Profiles.FindAsync(user.CurrentProfileId);
        var support = await _context.Profiles.SingleAsync(x => x.Type == ProfileType.Support);
        var message = new Message(
            request.Message.ConversationId,
            support.ProfileId,
            profile.ProfileId,
            request.Message.Body);
        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Message = message.ToDto()
        };
    }
}

