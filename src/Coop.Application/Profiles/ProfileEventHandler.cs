using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

 public class ProfileEventHandler : INotificationHandler<Coop.Domain.DomainEvents.CreateProfile>
 {
     private readonly ICoopDbContext _context;
     private readonly IOrchestrationHandler _messageHandlerContext;
     private readonly IConfiguration _configuration;
     public ProfileEventHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext, IConfiguration configuration)
     {
         _context = context;
         _messageHandlerContext = messageHandlerContext;
         _configuration = configuration;
     }
     public async Task Handle(Coop.Domain.DomainEvents.CreateProfile @event, CancellationToken cancellationToken)
     {
         @event.Address = Address.Default(_configuration);
         Profile profile = @event.ProfileType switch
         {
             Constants.ProfileTypes.Member => new Member(@event),
             Constants.ProfileTypes.BoardMember => new BoardMember(@event.Firstname, @event.Lastname),
             Constants.ProfileTypes.Staff => new StaffMember(@event.Firstname, @event.Lastname),
             _ => new Member(@event)
         };
         _context.Profiles.Add(profile);
         await _context.SaveChangesAsync(cancellationToken);
         await _messageHandlerContext.Publish(new Coop.Domain.DomainEvents.CreatedProfile() { ProfileId = profile.ProfileId });
     }
 }
