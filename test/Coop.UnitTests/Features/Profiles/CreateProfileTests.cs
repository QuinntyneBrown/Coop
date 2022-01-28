using Coop.Api;
using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using Coop.Testing;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;
using static Coop.Api.Features.CreateProfile;

namespace Coop.UnitTests.Features
{
    using Request = Coop.Api.Features.CreateProfile.Request;

    public class CreateProfileTests : TestBase
    {
        [Fact]
        public async Task CreateProfile()
        {
            var context = await CoopDbContextFactory.Create();

            var configuration = ConfigurationFactory.Create();

            var container = _serviceCollection
                .AddSingleton(context)
                .AddSingleton(configuration)
                .AddSingleton<Handler>()
                .AddSingleton<IPasswordHasher, PasswordHasher>()
                .AddMediatR(typeof(Startup))
                .AddSingleton<IOrchestrationHandler, OrchestrationHandler>()
                .AddSingleton<ITokenBuilder, TokenBuilder>()
                .AddSingleton<ITokenProvider, TokenProvider>()
                .AddSingleton<INotificationService, NotificationService>()
                .BuildServiceProvider();

            await context.SaveChangesAsync(default);

            var sut = container.GetRequiredService<Handler>();

            var result = await sut.Handle(new Request
            {

                Password = "Default",
                PasswordConfirmation = "Default",
                Email = "default@default.com",
                Firstname = "Firstname",
                Lastname = "Lastname",
                InvitationToken = Constants.InvitationTypes.Member
            }, default);

            Assert.Equal(ProfileType.Member, result.Profile.Type);
        }
    }
}
