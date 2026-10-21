using System.Security.Cryptography;
using Coop.Domain.Identity;
using Coop.Domain.Profiles;
using Coop.Infrastructure.Persistence;
using Coop.SharedKernel;
using Microsoft.EntityFrameworkCore;

namespace Coop.Cli.Seeding;

/// <summary>
/// The demo state laid over the API's startup seed (L2-REQ-103): one sign-in
/// per role, their profiles and fictional content for every admin screen and
/// the public site. People, places and contact details are fictional.
/// </summary>
public static class DemoSeed
{
    /// <summary>The address both apps call the API at.</summary>
    public const string DefaultApiUrl = "http://localhost:5000/api";

    public static async Task SeedAsync(CoopDbContext context, IPasswordHasher passwordHasher, string apiUrl)
    {
        await SeedAccountsAsync(context, passwordHasher);
    }

    private static async Task SeedAccountsAsync(CoopDbContext context, IPasswordHasher passwordHasher)
    {
        // The startup seed's member gets a resident's name and becomes their own current profile.
        var member = await context.Users.SingleAsync(u => u.Username == "member");
        var memberProfile = await context.Members.SingleAsync(m => m.UserId == member.UserId);
        memberProfile.Firstname = "Rosalind";
        memberProfile.Lastname = "Okafor";
        memberProfile.Email = "rosalind.okafor@coop.test";
        memberProfile.PhoneNumber = "416 555 0117";
        memberProfile.UnitNumber = "304";
        memberProfile.NoticeByEmail = true;
        member.SetCurrentProfileId(memberProfile.ProfileId);
        member.SetDefaultProfileId(memberProfile.ProfileId);

        var staff = await AddUserAsync(context, passwordHasher, "staff", "Staff123!", Constants.Roles.Staff);
        AddProfile(staff, new StaffMember
        {
            Firstname = "Priya",
            Lastname = "Raman",
            Email = "office@coop.test",
            PhoneNumber = "416 555 0142",
            JobTitle = "Co-op coordinator",
        });

        var board = await AddUserAsync(context, passwordHasher, "board", "Board123!", Constants.Roles.BoardMember);
        AddProfile(board, new BoardMember
        {
            Firstname = "Margaret",
            Lastname = "Lindqvist",
            Email = "margaret.lindqvist@coop.test",
            PhoneNumber = "416 555 0163",
            BoardTitle = "President",
        });

        await AddUserAsync(context, passwordHasher, "support", "Support123!", Constants.Roles.Support);

        await context.SaveChangesAsync();
    }

    private static async Task<User> AddUserAsync(CoopDbContext context, IPasswordHasher passwordHasher, string username, string password, string role)
    {
        var salt = new byte[16];
        RandomNumberGenerator.Fill(salt);
        var user = new User { Username = username, Salt = salt, Password = passwordHasher.HashPassword(salt, password) };
        user.Roles.Add(await context.Roles.SingleAsync(r => r.Name == role));
        context.Users.Add(user);
        return user;
    }

    private static void AddProfile(User user, ProfileBase profile)
    {
        user.AddProfile(profile);
        user.SetCurrentProfileId(profile.ProfileId);
        user.SetDefaultProfileId(profile.ProfileId);
    }
}
