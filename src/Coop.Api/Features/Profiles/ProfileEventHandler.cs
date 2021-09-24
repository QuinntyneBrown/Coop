using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class ProfileEventHandler : INotificationHandler<Coop.Core.DomainEvents.CreateProfile>
    {
        private readonly ICoopDbContext _context;
        private readonly IOrchestrationHandler _messageHandlerContext;

        public ProfileEventHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
        }

        public async Task Handle(Coop.Core.DomainEvents.CreateProfile notification, CancellationToken cancellationToken)
        {
            Profile profile = notification.ProfileType switch
            {
                Constants.ProfileTypes.Member => new Member(notification.Firstname, notification.Lastname),
                Constants.ProfileTypes.BoardMember => new BoardMember(notification.Firstname, notification.Lastname),
                Constants.ProfileTypes.Staff => new StaffMember(notification.Firstname, notification.Lastname),
                _ => new Member(notification.Firstname, notification.Lastname)
            };

            _context.Profiles.Add(profile);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new Coop.Core.DomainEvents.CreatedProfile() { ProfileId = profile.ProfileId });
        }
    }
}
