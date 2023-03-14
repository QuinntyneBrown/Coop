// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Testing;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddHttpContextAccessor(this IServiceCollection serviceCollection, User user = null)
    {
        serviceCollection
            .AddSingleton(new HttpContextAccessorBuilder().WithUser(user).Build());
        return serviceCollection;
    }
    public static IServiceCollection AddAuthorizationService(this IServiceCollection serviceCollection)
    {
        return serviceCollection
            .AddAuthorization()
            .AddLogging()
            .AddOptions()
            .AddSingleton<IAuthorizationHandler, ResourceOperationAuthorizationHandler>();
    }
}

