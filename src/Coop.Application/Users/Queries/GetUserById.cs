using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

 public class GetUserById
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
             return new()
             {
                 User = (await _context.Users
                 .Include(x => x.Roles)
                 .Include("Roles.Privileges")
                 .SingleOrDefaultAsync(x => x.UserId == request.UserId)).ToDto()
             };
         }
     }
 }
