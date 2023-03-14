using Coop.Domain.Interfaces;
using Coop.Infrastructure.Data;
using Coop.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;
using static Coop.Application.Features.CurrentUser;

namespace Coop.UnitTests;

 public class CurrentUserTests : TestBase
 {
     [Fact]
     public async Task ShouldGetNullUser()
     {
         var context = CoopDbContextFactory.Create();
         var container = _serviceCollection
             .AddSingleton(context)
             .AddHttpContextAccessor()
             .AddSingleton<Handler>()
             .BuildServiceProvider();
         var sut = container.GetRequiredService<Handler>();
         var result = await sut.Handle(new(), default);
         Assert.Null(result.User);
     }
     [Fact]
     public async Task ShouldGetUser()
     {
         var expectedUserName = "quinntynebrown@gmail.com";
         //var context = await CoopDbContextFactory.Create();
         var configuration = ConfigurationFactory.Create();
         _serviceCollection
             .AddDbContext<CoopDbContext>(o => o.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"]));
         var context = _serviceCollection.BuildServiceProvider().GetRequiredService<CoopDbContext>();
         var user = await context.Users.SingleAsync(x => x.Username == expectedUserName);
         await context.SaveChangesAsync(default);
         var container = _serviceCollection
             .AddSingleton<ICoopDbContext>(context)
             .AddHttpContextAccessor(user)
             .AddSingleton<Handler>()
             .BuildServiceProvider();
         var sut = container.GetRequiredService<Handler>();
         var result = await sut.Handle(new(), default);
         Assert.Equal(expectedUserName, result.User.Username);
     }
 }
