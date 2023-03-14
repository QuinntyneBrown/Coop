using Coop.Domain.Interfaces;

namespace Coop.Application.BoardMembers;

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
