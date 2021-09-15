using Coop.Api.Core;
using Coop.Api.Data;
using Coop.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using static Coop.Api.Features.Users.UpdatePassword;

namespace Coop.UnitTests
{
    public class UpdatePasswordTests : TestBase
    {
        [Fact]
        public async Task UpdatePassword()
        {
            var expectedNewPassword = "test";

            var context = await CoopDbContextFactory.Create();

            var container = _serviceCollection
                .AddSingleton<IPasswordHasher,PasswordHasher>()
                .AddSingleton(context)
                .AddSingleton<Handler>()
                .BuildServiceProvider();

            var passwordHasher = container.GetService<IPasswordHasher>();

            var sut = container.GetRequiredService<Handler>();

            var user = context.Users.Single(x => x.Username == SeedData.MEMBER_USERNAME);

            Assert.Equal(user.Password, passwordHasher.HashPassword(user.Salt, SeedData.PASSWORD));

            var result = await sut.Handle(new()
            {
                UserId = user.UserId,
                Password = expectedNewPassword
            }, default);

            user = context.Users.Find(user.UserId);

            Assert.Equal(user.Password, passwordHasher.HashPassword(user.Salt, expectedNewPassword));
        }
    }
}
