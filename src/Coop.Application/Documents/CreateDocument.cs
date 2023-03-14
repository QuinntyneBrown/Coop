using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

 public class CreateDocument
 {
     public class Validator : AbstractValidator<Request>
     {
         public Validator()
         {
             RuleFor(request => request.Document).NotNull();
             RuleFor(request => request.Document).SetValidator(new DocumentValidator());
         }
     }
     public class Request : IRequest<Response>
     {
         public DocumentDto Document { get; set; }
     }
     public class Response : ResponseBase
     {
         public DocumentDto Document { get; set; }
     }
     public class Handler : IRequestHandler<Request, Response>
     {
         private readonly ICoopDbContext _context;
         public Handler(ICoopDbContext context)
             => _context = context;
         public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
         {
             var document = new Document(default);
             _context.Documents.Add(document);
             await _context.SaveChangesAsync(cancellationToken);
             return new Response()
             {
                 Document = document.ToDto()
             };
         }
     }
 }
