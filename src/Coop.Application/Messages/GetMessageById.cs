using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

 public class GetMessageById
 {
     public class Request : IRequest<Response>
     {
         public Guid MessageId { get; set; }
     }
     public class Response : ResponseBase
     {
         public MessageDto Message { get; set; }
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
                 Message = (await _context.Messages.SingleOrDefaultAsync(x => x.MessageId == request.MessageId)).ToDto()
             };
         }
     }
 }
