// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Entities;
using Coop.Domain.Enums;
using Coop.Testing;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Coop.UnitTests;

[AuthorizeResourceOperation(nameof(Operations.Create), nameof(User))]
public class ResourceOperationAuthorizationBehaviorTestsRequest : IRequest<ResponseBase> { }
public class ResourceOperationAuthorizationBehaviorTests : TestBase
{
    [Fact]
    public async Task ShouldReturnErrorResponse()
    {
        async Task<ResponseBase> Noop()
        {
            return await Task.FromResult(new ResponseBase());
        }
        
        var expectedUserName = "Quinntyne";
        
        var context = await CoopDbContextFactory.Create();
        
        var user = new User(expectedUserName, "password", new PasswordHasher());
        
        context.Users.Add(user);
        
        await context.SaveChangesAsync(default);
        
        var container = _serviceCollection
            .AddAuthorizationService()
            .AddHttpContextAccessor(user)
            .AddSingleton<ResourceOperationAuthorizationBehavior<ResourceOperationAuthorizationBehaviorTestsRequest, ResponseBase>>()
            .BuildServiceProvider();
        
        var sut = container.GetRequiredService<ResourceOperationAuthorizationBehavior<ResourceOperationAuthorizationBehaviorTestsRequest, ResponseBase>>();
        
        var result = await sut.Handle(new ResourceOperationAuthorizationBehaviorTestsRequest(), default(CancellationToken), Noop);
        
        Assert.Single(result.Errors);
    }

    [Fact]
    public async Task ShouldExcuteNoop()
    {
        static async Task<ResponseBase> Noop()
        {
            return await Task.FromResult(new ResponseBase());
        }
        var expectedUserName = "Quinntyne";
        var context = await CoopDbContextFactory.Create();
        var privilege = new Privilege(AccessRight.Create, nameof(User));
        var role = new Role("Admin");
        role.Privileges.Add(privilege);
        var user = new User(expectedUserName, "password", new PasswordHasher());
        user.Roles.Add(role);
        context.Users.Add(user);
        await context.SaveChangesAsync(default);
        var container = _serviceCollection
            .AddAuthorizationService()
            .AddHttpContextAccessor(user)
            .AddSingleton<ResourceOperationAuthorizationBehavior<ResourceOperationAuthorizationBehaviorTestsRequest, ResponseBase>>()
            .BuildServiceProvider();
        var sut = container.GetRequiredService<ResourceOperationAuthorizationBehavior<ResourceOperationAuthorizationBehaviorTestsRequest, ResponseBase>>();
        var result = await sut.Handle(new ResourceOperationAuthorizationBehaviorTestsRequest(), default(CancellationToken), Noop);
        Assert.Empty(result.Errors);
    }
}

