using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class BoardMemberMessageHandler
    {
        private readonly ICoopDbContext _context;
        private readonly IOrchestrationHandler _messageHandlerContext;

        public BoardMemberMessageHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext)
        {
            _context = context;
            _messageHandlerContext = messageHandlerContext;
        }
    }
}
