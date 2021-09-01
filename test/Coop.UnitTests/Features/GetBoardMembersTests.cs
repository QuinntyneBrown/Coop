using Coop.Api.Interfaces;
using Coop.Testing;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;
using Xunit;
using static Coop.Api.Features.GetBoardMembers;

namespace Coop.UnitTests.Features
{
    public class GetBoardMembersTests
    {
        ServiceCollection _serviceCollection;

        public GetBoardMembersTests()
        {
            _serviceCollection = new ServiceCollection();
        }

        [Fact]
        public async Task ShouldGetOnBoardMember()
        {
            var expectedResult = 1;

            var container = _serviceCollection
                .AddInMemoryDbContext()
                .AddSingleton<IRequestHandler<Request, Response>, Handler>()
                .BuildServiceProvider();

            var context = container.GetService<ICoopDbContext>();

            context.BoardMembers.Add(new("President", "Quinntyne", "Brown", Guid.NewGuid()));

            await context.SaveChangesAsync(default);

            var sut = container.GetRequiredService<IRequestHandler<Request, Response>>();

            var result = await sut.Handle(new Request { }, default);

            Assert.Equal(expectedResult, result.BoardMembers.Count);
        }

        [Fact]
        public async Task ShouldGetZeroBoardMembers()
        {
            var expectedResult = 0;

            var container = _serviceCollection
                .AddInMemoryDbContext()
                .AddSingleton<IRequestHandler<Request, Response>, Handler>()
                .BuildServiceProvider();

            var sut = container.GetRequiredService<IRequestHandler<Request, Response>>();

            var result = await sut.Handle(new Request { }, default);

            Assert.Equal(expectedResult, result.BoardMembers.Count);
        }
    }
}
