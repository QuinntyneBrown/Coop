using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.BoardMembers;

 public class GetBoardMemberById
 {
     public class Request : IRequest<Response>
     {
         public Guid BoardMemberId { get; set; }
     }
     public class Response : ResponseBase
     {
         public BoardMemberDto BoardMember { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             return new()
             {
                 BoardMember = (await _context.BoardMembers.SingleOrDefaultAsync(x => x.ProfileId == request.BoardMemberId)).ToDto()
             };
         }
     }
 }
