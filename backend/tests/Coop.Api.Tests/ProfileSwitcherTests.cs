// Acceptance Test
// Traces to: L2-REQ-018 (AC4)
// Description: A person with more than one profile can tell them apart in the
// member app's Switch Profile list: each profile the API lists names its type.

using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json;
using Coop.Domain.Identity;
using Coop.Domain.Profiles;
using Coop.Infrastructure.Persistence;
using Coop.SharedKernel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Api.Tests;

public class ProfileSwitcherTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public ProfileSwitcherTests(CoopApiFactory factory) => _factory = factory;

    [Fact]
    public async Task Given_a_person_with_a_member_and_a_board_profile_when_they_list_their_profiles_then_each_names_its_type()
    {
        var username = $"ines-{Guid.NewGuid():N}";
        const string password = "Member123!";
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            var salt = RandomNumberGenerator.GetBytes(16);
            var user = new User { Username = username, Salt = salt, Password = hasher.HashPassword(salt, password) };
            user.Roles.Add(await context.Roles.SingleAsync(r => r.Name == Constants.Roles.Member));
            context.Users.Add(user);
            context.Members.Add(new Member { UserId = user.UserId, Firstname = "Ines", Lastname = "Fictional" });
            context.BoardMembers.Add(new BoardMember { UserId = user.UserId, Firstname = "Ines", Lastname = "Fictional" });
            await context.SaveChangesAsync();
        }
        var client = await _factory.CreateClientAsAsync(username, password);

        var profiles = await client.GetFromJsonAsync<JsonElement>("/api/user/profiles");

        var types = profiles.EnumerateArray().Select(p => p.GetProperty("profileType").GetString()).OrderBy(t => t).ToArray();
        Assert.Equal(new[] { "BoardMember", "Member" }, types);
    }
}
