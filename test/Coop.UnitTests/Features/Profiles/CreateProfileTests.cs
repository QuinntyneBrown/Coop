using Coop.Api;
using Coop.Api.Core;
using Coop.Api.Features;
using Coop.Api.Interfaces;
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

            var container = _serviceCollection
                .AddSingleton(context)
                .AddSingleton<Handler>()
                .AddSingleton<IPasswordHasher, PasswordHasher>()
                .AddMediatR(typeof(Startup))
                .AddSingleton<IMessageHandlerContext, MessageHandlerContext>()
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

            Assert.NotNull(result.Profile);
        }
    }
}
