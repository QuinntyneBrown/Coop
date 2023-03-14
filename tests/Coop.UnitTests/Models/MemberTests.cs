using Coop.Domain.DomainEvents;
using Coop.Domain.Entities;
using Coop.Testing;
using System.Threading.Tasks;
using Xunit;

namespace Coop.UnitTests.Models;

 public class MemberTests
 {
     [Fact]
     public async Task CreateMember()
     {
         var context = await CoopDbContextFactory.Create();
         var domainEvent = new CreateProfile("Member", "Quinntyne", "Brown", null);
         var member = new Member(domainEvent);
         context.Members.Add(member);
         await context.SaveChangesAsync(default);
         Assert.Equal(domainEvent.ProfileId, member.ProfileId);
     }
 }
