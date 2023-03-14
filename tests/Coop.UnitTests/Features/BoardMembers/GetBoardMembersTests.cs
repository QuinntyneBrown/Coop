// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.BoardMembers;
using Coop.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;

namespace Coop.UnitTests.Features;

public class GetBoardMembersTests : TestBase
{
    [Fact]
    public async Task ShouldGetBoardMembers()
    {
        var expectedResult = 1;
        var context = await CoopDbContextFactory.Create();
        var container = _serviceCollection
            .AddSingleton(context)
            .AddSingleton<GetBoardMembersHandler>()
            .BuildServiceProvider();
        context.BoardMembers.Add(new("President", "Quinntyne", "Brown"));
        await context.SaveChangesAsync(default);
        var sut = container.GetRequiredService<GetBoardMembersHandler>();
        var result = await sut.Handle(new(), default);
        Assert.Equal(expectedResult, result.BoardMembers.Count);
    }
}

