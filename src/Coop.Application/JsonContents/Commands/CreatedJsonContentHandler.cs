using Coop.Application.JsonContents.Exceptions;
using Coop.Domain.DomainEvents;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features.JsonContents;

 public class CreatedJsonContentHandler : INotificationHandler<CreatedJsonContent>
 {
     private readonly ICoopDbContext _context;
     public CreatedJsonContentHandler(ICoopDbContext context)
     {
         _context = context;
     }
     public async Task Handle(CreatedJsonContent notification, CancellationToken cancellationToken)
     {
         if (await _context.JsonContents.Where(x => x.Name == notification.Name).CountAsync() > 1)
         {
             throw new DuplicateJsonContent();
         }
     }
 }
