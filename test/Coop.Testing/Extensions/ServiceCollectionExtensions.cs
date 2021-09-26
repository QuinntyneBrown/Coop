using Coop.Core;
using Coop.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Testing
{
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
}
