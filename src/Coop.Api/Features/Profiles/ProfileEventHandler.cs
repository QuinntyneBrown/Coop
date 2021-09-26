using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using Coop.Core;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

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

        public async Task Handle(Coop.Core.DomainEvents.CreateProfile notification, CancellationToken cancellationToken)
        {
            var defaultAddress = Address.Create(
                _configuration["DefaultAddress:Street"],
                _configuration["DefaultAddress:City"],
                _configuration["DefaultAddress:Province"],
                _configuration["DefaultAddress:PostalCode"]).Value;

            Profile profile = notification.ProfileType switch
            {
                Constants.ProfileTypes.Member => new Member(notification.Firstname, notification.Lastname, defaultAddress),
                Constants.ProfileTypes.BoardMember => new BoardMember(notification.Firstname, notification.Lastname),
                Constants.ProfileTypes.Staff => new StaffMember(notification.Firstname, notification.Lastname),
                _ => new Member(notification.Firstname, notification.Lastname, defaultAddress)
            };

            _context.Profiles.Add(profile);

            await _context.SaveChangesAsync(cancellationToken);

            await _messageHandlerContext.Publish(new Coop.Core.DomainEvents.CreatedProfile() { ProfileId = profile.ProfileId });
        }
    }
}
