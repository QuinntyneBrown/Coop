using Coop.Api.Data;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Respawn;
using System;
using System.Threading.Tasks;

namespace Coop.Testing
{
    public static class CoopDbContextFactory
    {
        private static Checkpoint _checkpoint;

        public static async Task<ICoopDbContext> Create()
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
                    options.UseSqlServer(configuration["ConnectionStrings:TestConnection"]);
                })
                .BuildServiceProvider();

            var context = container.GetService<CoopDbContext>();

            await context.Database.MigrateAsync();

            await context.Database.EnsureCreatedAsync();

            var connection = context.Database.GetDbConnection();

            await _checkpoint.Reset(configuration["ConnectionStrings:TestConnection"]);

            SeedData.Seed(context, configuration);

            return context;

        }

    }
}
