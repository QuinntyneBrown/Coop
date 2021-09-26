using Coop.Api.Data;
using Coop.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Respawn;
using System.Threading.Tasks;

namespace Coop.Testing
{
    public static class CoopDbContextFactory
    {
        private static Checkpoint _checkpoint;

        public static async Task<ICoopDbContext> Create(string nameOfConnectionString = "ConnectionStrings:TestConnection")
        {
            var configuration = ConfigurationFactory.Create();

            _checkpoint = new Checkpoint()
            {
                TablesToIgnore = new string[1] {
                "__EFMigrationsHistory"
                }
            };

            var container = new ServiceCollection()
                .AddDbContext<CoopDbContext>(options =>
                {
                    options.UseSqlServer(configuration[nameOfConnectionString]);
                })
                .BuildServiceProvider();

            var context = container.GetService<CoopDbContext>();

            await context.Database.MigrateAsync();

            await context.Database.EnsureCreatedAsync();

            var connection = context.Database.GetDbConnection();

            await _checkpoint.Reset(configuration[nameOfConnectionString]);

            SeedData.Seed(context, configuration);

            return context;

        }

    }
}
