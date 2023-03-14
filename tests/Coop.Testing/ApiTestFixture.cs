using Coop.Api;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;

namespace Coop.Testing;

public class ApiTestFixture : WebApplicationFactory<Startup>, IDisposable
{
    public ApiTestFixture()
    {
    }
    public new HttpClient CreateClient()
    {
        var client = base.CreateClient();
        return client;
    }
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            var serviceProvider = services.BuildServiceProvider();
            using (var scope = serviceProvider.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
            }
        });
    }
}
