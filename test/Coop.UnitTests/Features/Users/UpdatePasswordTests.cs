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
            var context = await CoopDbContextFactory.Create();

            var container = _serviceCollection
                .AddSingleton<IPasswordHasher,PasswordHasher>()                
                .AddSingleton(context)
                .AddSingleton<Handler>()
                .BuildServiceProvider();

            var sut = container.GetRequiredService<Handler>();

            var user = context.Users.Single(x => x.Username == SeedData.MEMBER_USERNAME);

            var result = await sut.Handle(new Api.Features.Users.UpdatePassword.Request
            {
                UserId = user.UserId,
                Password = "Test"

            }, default);

        }
    }
}
