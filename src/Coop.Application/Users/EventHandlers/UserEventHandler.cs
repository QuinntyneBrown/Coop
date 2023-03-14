// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Features.Users;
using Coop.Domain;
using Coop.Domain.DomainEvents;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

using Messages = Coop.Domain.DomainEvents;
public class UserEventHandler :
    INotificationHandler<Messages.AddProfile>,
    INotificationHandler<Messages.CreateUser>,
    INotificationHandler<BuildToken>
{
    private readonly ICoopDbContext _context;
    private readonly IOrchestrationHandler _orchestrationHandler;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenBuilder _tokenBuilder;
    public UserEventHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext, IPasswordHasher passwordHasher, ITokenBuilder tokenBuilder)
    {
        _context = context;
        _orchestrationHandler = messageHandlerContext;
        _passwordHasher = passwordHasher;
        _tokenBuilder = tokenBuilder;
    }
    public async Task Handle(Messages.AddProfile notification, CancellationToken cancellationToken)
    {
        var (userId, profileId) = notification;
        var user = await _context.Users
            .Include(x => x.Profiles)
            .SingleAsync(x => x.UserId == userId);
        var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == profileId);
        user.AddProfile(profile);
        await _context.SaveChangesAsync(cancellationToken);
        await _orchestrationHandler.Publish(new AddedProfile
        {
            UserId = userId,
            ProfileId = profileId
        });
    }
    public async Task Handle(Messages.CreateUser notification, CancellationToken cancellationToken)
    {
        var user = new User(notification.Username, notification.Password, _passwordHasher);
        foreach (var roleName in notification.Roles)
        {
            var role = await _context.Roles.SingleAsync(x => x.Name == roleName);
            user.Roles.Add(role);
        }
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        await _orchestrationHandler.Publish(new CreatedUser(user.UserId));
    }
    public async Task Handle(BuildToken notification, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .SingleAsync(x => x.Username == notification.Username);
        _tokenBuilder
            .AddUsername(user.Username)
            .AddClaim(new System.Security.Claims.Claim(Constants.ClaimTypes.UserId, $"{user.UserId}"))
            .AddClaim(new System.Security.Claims.Claim(Constants.ClaimTypes.Username, $"{user.Username}"));
        foreach (var role in user.Roles)
        {
            _tokenBuilder.AddClaim(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, role.Name));
            foreach (var privilege in role.Privileges)
            {
                _tokenBuilder.AddClaim(new System.Security.Claims.Claim(Constants.ClaimTypes.Privilege, $"{privilege.AccessRight}{privilege.Aggregate}"));
            }
        }
        await _orchestrationHandler.PublishBuiltTokenEvent(user.UserId, _tokenBuilder.Build());
    }
}

