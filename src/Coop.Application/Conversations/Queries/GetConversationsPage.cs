using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

 public class GetConversationsPage
 {
     public class Request : IRequest<Response>
     {
         public int PageSize { get; set; }
         public int Index { get; set; }
     }
     public class Response : ResponseBase
     {
         public int Length { get; set; }
         public List<ConversationDto> Entities { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var query = from conversation in _context.Conversations
                         select conversation;
             var length = await _context.Conversations.CountAsync();
             var conversations = await query.Page(request.Index, request.PageSize)
                 .Select(x => x.ToDto()).ToListAsync();
             return new()
             {
                 Length = length,
                 Entities = conversations
             };
         }
     }
 }
