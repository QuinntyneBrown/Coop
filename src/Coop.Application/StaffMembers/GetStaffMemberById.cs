using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

 public class GetStaffMemberById
 {
     public class Request : IRequest<Response>
     {
         public Guid StaffMemberId { get; set; }
     }
     public class Response : ResponseBase
     {
         public StaffMemberDto StaffMember { get; set; }
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
                 StaffMember = (await _context.StaffMembers.SingleOrDefaultAsync(x => x.StaffMemberId == request.StaffMemberId)).ToDto()
             };
         }
     }
 }
