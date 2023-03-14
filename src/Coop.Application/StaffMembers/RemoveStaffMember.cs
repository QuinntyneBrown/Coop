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

 public class RemoveStaffMember
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
             var staffMember = await _context.StaffMembers.SingleAsync(x => x.StaffMemberId == request.StaffMemberId);
             _context.StaffMembers.Remove(staffMember);
             await _context.SaveChangesAsync(cancellationToken);
             return new Response()
             {
                 StaffMember = staffMember.ToDto()
             };
         }
     }
 }
