using Coop.Api.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Testing
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInMemoryDbContext(this IServiceCollection services)
        {
            services.AddSingleton<ICoopDbContext>(new CoopDbContextBuilder()
                .UseInMemoryDatabase()
                .Build());

            return services;
        }
    }
}
