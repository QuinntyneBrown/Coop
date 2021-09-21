using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Core.Messages;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class UserMessageHandler : INotificationHandler<Coop.Core.Messages.AddProfile>
    {
        private readonly ICoopDbContext _context;
        private readonly IMessageHandlerContext _messageHandlerContext;

        public UserMessageHandler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
        }

        public async Task Handle(Coop.Core.Messages.AddProfile notification, CancellationToken cancellationToken)
        {
            var (userId, profileId) = notification;

            var user = await _context.Users.Include(x => x.Profiles).SingleAsync(x => x.UserId ==  userId);

            var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == profileId);

            user.AddProfile(profile);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new AddedProfile
            {
                UserId = userId,
                ProfileId = profileId
            });
        }
    }
}
