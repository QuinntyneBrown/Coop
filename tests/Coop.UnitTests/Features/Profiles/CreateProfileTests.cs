// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Api;
using Coop.Application.Features;
using Coop.Domain;
using Coop.Domain.Enums;
using Coop.Domain.Interfaces;
using Coop.Testing;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;

namespace Coop.UnitTests.Features;

using Request = Coop.Application.Features.CreateProfileRequest;
public class CreateProfileTests : TestBase
{
    [Fact]
    public async Task CreateProfile()
    {
        var context = await CoopDbContextFactory.Create();
        var configuration = ConfigurationFactory.Create();
        var container = _serviceCollection
            .AddSingleton(context)
            .AddSingleton(configuration)
            .AddSingleton<CreateProfileHandler>()
            .AddSingleton<IPasswordHasher, PasswordHasher>()
            .AddMediatR(typeof(Startup))
            .AddSingleton<IOrchestrationHandler, OrchestrationHandler>()
            .AddSingleton<ITokenBuilder, TokenBuilder>()
            .AddSingleton<ITokenProvider, TokenProvider>()
            .AddSingleton<INotificationService, NotificationService>()
            .BuildServiceProvider();
        await context.SaveChangesAsync(default);
        var sut = container.GetRequiredService<CreateProfileHandler>();
        var result = await sut.Handle(new Request
        {
            Password = "Default",
            PasswordConfirmation = "Default",
            Email = "default@default.com",
            Firstname = "Firstname",
            Lastname = "Lastname",
            InvitationToken = Constants.InvitationTypes.Member
        }, default);
        Assert.Equal(ProfileType.Member, result.Profile.Type);
    }
}

