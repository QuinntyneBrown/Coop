using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

 public class RemoveInvitationToken
 {
     public class Request : IRequest<Response>
     {
         public Guid InvitationTokenId { get; set; }
     }
     public class Response : ResponseBase
     {
         public InvitationTokenDto InvitationToken { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var invitationToken = await _context.InvitationTokens.SingleAsync(x => x.InvitationTokenId == request.InvitationTokenId);
             _context.InvitationTokens.Remove(invitationToken);
             await _context.SaveChangesAsync(cancellationToken);
             return new Response()
             {
                 InvitationToken = invitationToken.ToDto()
             };
         }
     }
 }
