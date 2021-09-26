using Coop.Api;
using Coop.Core;
using Coop.Api.Data;
using Coop.Api.Features;
using Coop.Core.Interfaces;
using Coop.Core.Models;
using Coop.Testing;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using static Coop.Api.Features.Authenticate;

namespace Coop.UnitTests
{
    public class AuthenticateTests : TestBase
    {
        [Fact]
        public async Task ShouldGetNullUser()
        {
            var configuration = ConfigurationFactory.Create();

            var context = await CoopDbContextFactory.Create();

            var container = _serviceCollection
                .AddSingleton(context)
                .AddSingleton(configuration)
                .AddSingleton<IPasswordHasher, PasswordHasher>()
                .AddSingleton<ITokenBuilder, TokenBuilder>()
                .AddSingleton<ITokenProvider, TokenProvider>()
                .AddSingleton<IOrchestrationHandler, OrchestrationHandler>()
                .AddMediatR(typeof(Startup))
                .AddHttpContextAccessor()
                .AddSingleton<Handler>()
                .BuildServiceProvider();

            var sut = container.GetRequiredService<Handler>();

            var result = await sut.Handle(new Authenticate.Request("", ""), default);

            Assert.Null(result.AccessToken);
        }

    }
}
