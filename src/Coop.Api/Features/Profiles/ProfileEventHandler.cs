using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class ProfileEventHandler : INotificationHandler<Coop.Core.DomainEvents.CreateProfile>
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

        public async Task Handle(Coop.Core.DomainEvents.CreateProfile @event, CancellationToken cancellationToken)
        {
            var defaultAddress = Address.Create(
                _configuration["DefaultAddress:Street"],
                _configuration["DefaultAddress:City"],
                _configuration["DefaultAddress:Province"],
                _configuration["DefaultAddress:PostalCode"]).Value;

            @event.Address = defaultAddress;

            Profile profile = @event.ProfileType switch
            {
                Constants.ProfileTypes.Member => new Member(@event),
                Constants.ProfileTypes.BoardMember => new BoardMember(@event.Firstname, @event.Lastname),
                Constants.ProfileTypes.Staff => new StaffMember(@event.Firstname, @event.Lastname),
                _ => new Member(@event)
            };

            _context.Profiles.Add(profile);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new Coop.Core.DomainEvents.CreatedProfile() { ProfileId = profile.ProfileId });
        }
    }
}
