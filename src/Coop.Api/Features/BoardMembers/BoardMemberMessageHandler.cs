using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class BoardMemberMessageHandler
    {
        private readonly ICoopDbContext _context;
        private readonly IMessageHandlerContext _messageHandlerContext;

        public BoardMemberMessageHandler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
        }
    }
}
