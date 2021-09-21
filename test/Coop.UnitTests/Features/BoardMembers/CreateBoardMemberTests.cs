using Coop.Api;
using Coop.Api.Core;
using Coop.Api.Features;
using Coop.Api.Interfaces;
using Coop.Testing;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;
using static Coop.Api.Features.CreateBoardMember;

namespace Coop.UnitTests.Features
{
    using Request = Coop.Api.Features.CreateBoardMember.Request;

    public class CreateBoardMembersTests : TestBase
    {
        [Fact]
        public async Task CreateBoardMember()
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

            var result = await sut.Handle(new Request { 
                User = new UserDto
                {
                    Username = "Default",
                    Password = "Default"
                },
                BoardMember = new BoardMemberDto
                {
                    BoardTitle = "Default",
                    Firstname = "Default",
                    Lastname = "Default"
                }            
            }, default);

            Assert.NotNull(result.BoardMember);
        }
    }
}
