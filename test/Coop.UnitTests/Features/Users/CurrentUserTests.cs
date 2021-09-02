using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using Coop.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;
using static Coop.Api.Features.CurrentUser;

namespace Coop.UnitTests
{
    public class CurrentUserTests : TestBase
    {
        [Fact]
        public async Task ShouldGetNullUser()
        {
            var context = new CoopDbContextBuilder()
                .UseInMemoryDatabase()
                .Build();

            var container = _serviceCollection
                .AddSingleton<ICoopDbContext>(context)
                .AddHttpContextAccessor()
                .AddSingleton<Handler>()
                .BuildServiceProvider();

            var sut = container.GetRequiredService<Handler>();

            var result = await sut.Handle(new(), default);

            Assert.Null(result.User);
        }

        [Fact]
        public async Task ShouldGetUser()
        {
            var expectedUserName = "Quinntyne";

            var context = new CoopDbContextBuilder()
                .UseInMemoryDatabase()
                .Build();

            var user = new User(expectedUserName, "password", new PasswordHasher());

            context.Users.Add(user);

            context.SaveChanges();

            var container = _serviceCollection
                .AddSingleton<ICoopDbContext>(context)
                .AddHttpContextAccessor(user)
                .AddSingleton<Handler>()
                .BuildServiceProvider();

            var sut = container.GetRequiredService<Handler>();

            var result = await sut.Handle(new(), default);

            Assert.Equal(expectedUserName, result.User.Username);
        }
    }
}
