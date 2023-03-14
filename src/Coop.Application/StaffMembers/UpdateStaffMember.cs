using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

 public class UpdateStaffMember
 {
     public class Validator : AbstractValidator<Request>
     {
         public Validator()
         {
             RuleFor(request => request.StaffMember).NotNull();
             RuleFor(request => request.StaffMember).SetValidator(new StaffMemberValidator());
         }
     }
     public class Request : IRequest<Response>
     {
         public StaffMemberDto StaffMember { get; set; }
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
             var staffMember = await _context.StaffMembers.SingleAsync(x => x.StaffMemberId == request.StaffMember.StaffMemberId);
             await _context.SaveChangesAsync(cancellationToken);
             return new Response()
             {
                 StaffMember = staffMember.ToDto()
             };
         }
     }
 }
