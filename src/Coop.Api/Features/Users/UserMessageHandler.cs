using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using Coop.Core.Messages;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;


namespace Coop.Api.Features
{
    using Messages = Coop.Core.Messages;

    public class UserMessageHandler : INotificationHandler<Messages.AddProfile>
    {
        private readonly ICoopDbContext _context;
        private readonly IMessageHandlerContext _messageHandlerContext;
        private readonly IPasswordHasher _passwordHasher;

        public UserMessageHandler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext, IPasswordHasher passwordHasher)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
            _passwordHasher = passwordHasher;
        }

        public async Task Handle(Messages.AddProfile notification, CancellationToken cancellationToken)
        {
            var (userId, profileId) = notification;

            var user = await _context.Users
                .Include(x => x.Profiles)
                .SingleAsync(x => x.UserId ==  userId);
                  
            var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == profileId);

            user.AddProfile(profile);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new AddedProfile
            {
                UserId = userId,
                ProfileId = profileId
            });
        }

        public async Task Handle(Messages.CreateUser notification, CancellationToken cancellationToken)
        {
            var user = new User(notification.Username, notification.Password, _passwordHasher);

            foreach(var roleName in notification.Roles)
            {
                var role = await _context.Roles.SingleAsync(x => x.Name == roleName);

                user.Roles.Add(role);
            }

            _context.Users.Add(user);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new CreatedUser(user.UserId));
        }
    }
}
