using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class MemberMessageHandler : INotificationHandler<Coop.Core.Messages.CreateProfile>
    {
        private readonly ICoopDbContext _context;
        private readonly IMessageHandlerContext _messageHandlerContext;

        public MemberMessageHandler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
        }

        public async Task Handle(Coop.Core.Messages.CreateProfile notification, CancellationToken cancellationToken)
        {
            var member = new Member(notification.Firstname, notification.Lastname);

            _context.Members.Add(member);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new Coop.Core.Messages.CreatedProfile() { ProfileId = member.ProfileId, UserId = member.UserId.Value });
        }
    }
}
