using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using Coop.Domain.DomainEvents;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.JsonContents;

 public class CreateJsonContent
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
         private readonly IOrchestrationHandler _messageHandlerContext;
         public Handler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext)
         {
             _context = context;
             _messageHandlerContext = messageHandlerContext;
         }
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var jsonContent = new JsonContent(request.JsonContent.Name, request.JsonContent.Json);
             _context.JsonContents.Add(jsonContent);
             await _context.SaveChangesAsync(cancellationToken);
             var repsonse = new Response
             {
                 JsonContent = jsonContent.ToDto()
             };
             try
             {
                 await _messageHandlerContext.Publish(new CreatedJsonContent
                 {
                     JsonContentId = jsonContent.JsonContentId,
                     Name = jsonContent.Name
                 });
             }
             catch
             {
                 _context.JsonContents.Remove(jsonContent);
                 await _context.SaveChangesAsync(default);
                 repsonse = new Response
                 {
                     Errors = new List<string>
                     {
                         "Duplicate Name"
                     }
                 };
             }
             return repsonse;
         }
     }
 }
