using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class BoardMemberMessageHandler : INotificationHandler<Coop.Core.Messages.CreateBoardMember>
    {
        private readonly ICoopDbContext _context;
        private readonly IMessageHandlerContext _messageHandlerContext;

        public BoardMemberMessageHandler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
        }

        public async Task Handle(Coop.Core.Messages.CreateBoardMember notification, CancellationToken cancellationToken)
        {
            var boardMember = new BoardMember(notification.UserId, notification.BoardTitle, notification.Firstname, notification.Lastname);

            _context.BoardMembers.Add(boardMember);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new Coop.Core.Messages.CreatedBoardMember() { ProfileId = boardMember.ProfileId, UserId = boardMember.UserId.Value });
        }
    }
}
