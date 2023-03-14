using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

 public class UpdateProfileAvatar
 {
     public class Request : IRequest<Response>
     {
         public Guid ProfileId { get; set; }
         public Guid DigitalAssetId { get; set; }
     }
     public class Response : ResponseBase { }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == request.ProfileId);
             profile.SetAvatar(request.DigitalAssetId);
             await _context.SaveChangesAsync(cancellationToken);
             return new();
         }
     }
 }
