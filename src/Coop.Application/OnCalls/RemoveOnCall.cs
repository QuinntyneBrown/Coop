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

 public class RemoveOnCall
 {
     public class Request : IRequest<Response>
     {
         public Guid OnCallId { get; set; }
     }
     public class Response : ResponseBase
     {
         public OnCallDto OnCall { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var onCall = await _context.OnCalls.SingleAsync(x => x.OnCallId == request.OnCallId);
             _context.OnCalls.Remove(onCall);
             await _context.SaveChangesAsync(cancellationToken);
             return new Response()
             {
                 OnCall = onCall.ToDto()
             };
         }
     }
 }
