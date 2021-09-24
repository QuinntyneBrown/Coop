using Coop.Api.Core;
using Coop.Api.Interfaces;

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
