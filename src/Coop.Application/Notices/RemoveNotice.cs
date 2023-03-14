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

 public class RemoveNotice
 {
     public class Request : IRequest<Response>
     {
         public Guid NoticeId { get; set; }
     }
     public class Response : ResponseBase
     {
         public NoticeDto Notice { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var notice = await _context.Notices.SingleAsync(x => x.NoticeId == request.NoticeId);
             _context.Notices.Remove(notice);
             await _context.SaveChangesAsync(cancellationToken);
             return new Response()
             {
                 Notice = notice.ToDto()
             };
         }
     }
 }
