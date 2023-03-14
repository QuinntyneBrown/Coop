using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

 public class RemoveUser
 {
     public class Request : IRequest<Response>
     {
         public Guid UserId { get; set; }
     }
     public class Response : ResponseBase
     {
         public UserDto User { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var user = await _context.Users.SingleAsync(x => x.UserId == request.UserId);
             user.Delete();
             await _context.SaveChangesAsync(cancellationToken);
             return new()
             {
                 User = user.ToDto()
             };
         }
     }
 }
