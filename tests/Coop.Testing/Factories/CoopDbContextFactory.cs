// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Infrastructure.Data;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Respawn;
using System.Threading.Tasks;

namespace Coop.Testing;

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
            .AddSingleton<INotificationService, NotificationService>()
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

