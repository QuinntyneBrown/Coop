using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

 public class GetJsonContentByName
 {
     public class Request : IRequest<Response>
     {
         public string? Name { get; set; }
     }
     public class Response : ResponseBase
     {
         public JsonContentDto? JsonContent { get; set; }
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
                 JsonContent = (await _context.JsonContents.SingleOrDefaultAsync(x => x.Name == request.Name)).ToDto()
             };
         }
     }
 }
