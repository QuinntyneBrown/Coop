using Coop.Api.Interfaces;
using Coop.Api.Models;
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
        ServiceCollection _services;

        public GetBoardMembersTests()
        {
            _services = new ServiceCollection();
        }

        [Fact]
        public async Task ShouldGetBoardMembers()
        {
            var expectedResult = 1;

            var context = new CoopDbContextBuilder()
                .UseInMemoryDatabase()
                .Build();

            context.BoardMembers.Add(new ("President", "Quinntyne", "Brown", Guid.NewGuid()));

            context.SaveChanges();

            _services.AddSingleton<ICoopDbContext>(context);
            _services.AddSingleton<IRequestHandler<Request, Response>, Handler>();
            
            var container = _services.BuildServiceProvider();

            var sut = container.GetRequiredService<IRequestHandler<Request, Response>>();

            var result = await sut.Handle(new Request { }, default);

            Assert.Equal(expectedResult, result.BoardMembers.Count);

        }
    }
}
