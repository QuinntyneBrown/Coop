// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Api;
using Coop.Application.Features;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Infrastructure.Data;
using Coop.Testing;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;


namespace Coop.UnitTests;

public class ChangePasswordTests : TestBase
{
    [Fact]
    public async Task ShouldGetNullUser()
    {
        var configuration = ConfigurationFactory.Create();
        var container = _serviceCollection
            .AddDbContext<CoopDbContext>(
                o => o.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"])
            )
            .AddSingleton(configuration)
            .AddSingleton<ICoopDbContext, CoopDbContext>()
            .AddSingleton<IPasswordHasher, PasswordHasher>()
            .AddSingleton<ITokenBuilder, TokenBuilder>()
            .AddSingleton<ITokenProvider, TokenProvider>()
            .AddSingleton<IOrchestrationHandler, OrchestrationHandler>()
            .AddMediatR(typeof(Startup))
            .AddHttpContextAccessor()
            .AddSingleton<ChangePasswordHandler>()
            .BuildServiceProvider();
        var sut = container.GetRequiredService<ChangePasswordHandler>();
        var result = await sut.Handle(new ChangePasswordRequest
        {
        }, default);
        Assert.Null(result);
    }
}

