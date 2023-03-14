// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Api;
using Coop.Application.Features;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Testing;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;

namespace Coop.UnitTests;

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
            .AddSingleton<AuthenticateHandler>()
            .BuildServiceProvider();
        var sut = container.GetRequiredService<AuthenticateHandler>();
        var result = await sut.Handle(new AuthenticateRequest("", ""), default);
        Assert.Null(result.AccessToken);
    }
}

