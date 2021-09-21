using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Core.Messages;
using Coop.Core.Messages.InvitationToken;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features.InvitationTokens
{
    public class InvitationTokenMessageHandler : INotificationHandler<ValidateInvitationToken>
    {
        private readonly ICoopDbContext _context;
        private readonly IMessageHandlerContext _messageHandlerContext;

        public InvitationTokenMessageHandler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
        }

        public async Task Handle(ValidateInvitationToken notification, CancellationToken cancellationToken)
        {
            await _messageHandlerContext.Publish(new ValidatedInvitationToken()
            {
                IsValid = _context.InvitationTokens.SingleOrDefault(x => x.Expiry == null || x.Expiry.Value > DateTime.UtcNow) != null
            });
        }
    }
}
