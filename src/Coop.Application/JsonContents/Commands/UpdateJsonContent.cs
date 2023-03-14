using Coop.Domain;
using Coop.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

 public class UpdateJsonContent
 {
     public class Validator : AbstractValidator<Request>
     {
         public Validator()
         {
             RuleFor(request => request.JsonContent).NotNull();
             RuleFor(request => request.JsonContent).SetValidator(new JsonContentValidator());
         }
     }
     public class Request : IRequest<Response>
     {
         public JsonContentDto JsonContent { get; set; }
     }
     public class Response : ResponseBase
     {
         public JsonContentDto JsonContent { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var jsonContent = await _context.JsonContents.SingleAsync(x => x.JsonContentId == request.JsonContent.JsonContentId);
             jsonContent.SetJson(request.JsonContent.Json);
             await _context.SaveChangesAsync(cancellationToken);
             return new Response()
             {
                 JsonContent = jsonContent.ToDto()
             };
         }
     }
 }
