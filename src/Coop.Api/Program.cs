// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using System;
using System.Linq;

namespace Coop.Api;

public class Program
{
    public static void Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .CreateBootstrapLogger();
        try
        {
            Log.Information("Starting web host");
            var host = CreateHostBuilder(args).Build();
            ProcessDbCommands(args, host);
            host.Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
    private static void ProcessDbCommands(string[] args, IHost host)
    {
        var services = (IServiceScopeFactory)host.Services.GetService(typeof(IServiceScopeFactory));
        using (var scope = services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            if (args.Contains("ci"))
                args = new string[4] { "dropdb", "migratedb", "seeddb", "stop" };
            if (args.Contains("dropdb"))
            {
                context.Database.EnsureDeleted();
            }
            if (args.Contains("migratedb"))
            {
                context.Database.Migrate();
            }
            if (args.Contains("seeddb"))
            {
                SeedData.Seed(context, configuration);
            }
            if (args.Contains("stop"))
                Environment.Exit(0);
        }
    }
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .UseSerilog((context, services, configuration) => configuration
                .ReadFrom.Configuration(context.Configuration)
                .ReadFrom.Services(services)
                .Enrich.FromLogContext())
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

