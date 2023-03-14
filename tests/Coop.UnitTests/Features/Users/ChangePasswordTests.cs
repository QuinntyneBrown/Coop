using Coop.Api;
using Coop.Application.Features;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Infrastructure.Data;
using Coop.Testing;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;
using static Coop.Application.Features.ChangePassword;

namespace Coop.UnitTests;

 public class ChangePasswordTests : TestBase
 {
     [Fact]
     public async Task ShouldGetNullUser()
     {
         var configuration = ConfigurationFactory.Create();
         var container = _serviceCollection
             .AddDbContext<CoopDbContext>(
                 o => o.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"])
             )
             .AddSingleton(configuration)
             .AddSingleton<ICoopDbContext, CoopDbContext>()
             .AddSingleton<IPasswordHasher, PasswordHasher>()
             .AddSingleton<ITokenBuilder, TokenBuilder>()
             .AddSingleton<ITokenProvider, TokenProvider>()
             .AddSingleton<IOrchestrationHandler, OrchestrationHandler>()
             .AddMediatR(typeof(Startup))
             .AddHttpContextAccessor()
             .AddSingleton<Handler>()
             .BuildServiceProvider();
         var sut = container.GetRequiredService<Handler>();
         var result = await sut.Handle(new ChangePassword.Request
         {
         }, default);
         Assert.Null(result);
     }
 }
