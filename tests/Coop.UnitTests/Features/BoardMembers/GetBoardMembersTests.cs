using Coop.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;
using static Coop.Application.BoardMembers.GetBoardMembers;

namespace Coop.UnitTests.Features
{
    public class GetBoardMembersTests : TestBase
    {
        [Fact]
        public async Task ShouldGetBoardMembers()
        {
            var expectedResult = 1;

            var context = await CoopDbContextFactory.Create();

            var container = _serviceCollection
                .AddSingleton(context)
                .AddSingleton<Handler>()
                .BuildServiceProvider();

            context.BoardMembers.Add(new("President", "Quinntyne", "Brown"));

            await context.SaveChangesAsync(default);

            var sut = container.GetRequiredService<Handler>();

            var result = await sut.Handle(new(), default);

            Assert.Equal(expectedResult, result.BoardMembers.Count);
        }
    }
}
