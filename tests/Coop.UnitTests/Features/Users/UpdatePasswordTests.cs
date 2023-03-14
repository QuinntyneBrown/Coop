// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Features.Users;
using Coop.Domain;
using Coop.Infrastructure.Data;
using Coop.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;
using Xunit;


namespace Coop.UnitTests;

public class UpdatePasswordTests : TestBase
{
    [Fact]
    public async Task UpdatePassword()
    {
        var expectedNewPassword = "test";
        
        var context = await CoopDbContextFactory.Create();
        
        var container = _serviceCollection
            .AddSingleton<IPasswordHasher, PasswordHasher>()
            .AddSingleton(context)
            .AddSingleton<UpdatePasswordHandler>()
            .BuildServiceProvider();
        
        var passwordHasher = container.GetService<IPasswordHasher>();
        
        var sut = container.GetRequiredService<UpdatePasswordHandler>();
        
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

