using System.Security.Cryptography;
using System.Text.Json;
using Coop.Application.CMS.Board;
using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.SiteContent;
using Coop.Domain.Assets;
using Coop.Domain.CMS;
using Coop.Domain.Identity;
using Coop.Domain.Profiles;
using Coop.Infrastructure.Persistence;
using Coop.Infrastructure.Persistence.Seeding;
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
        var photos = await SeedPhotosAsync(context, apiUrl.TrimEnd('/'));
        await SeedSiteContentAsync(context, photos);
        await SeedPagesAsync(context, photos);
        await SeedBoardAsync(context, photos);
    }

    /// <summary>Stores each photograph as a digital asset and returns its address by file name (L2-REQ-103 AC5).</summary>
    private static async Task<IReadOnlyDictionary<string, string>> SeedPhotosAsync(CoopDbContext context, string apiUrl)
    {
        var addresses = new Dictionary<string, string>();
        foreach (var photo in DemoPhotos.All())
        {
            var asset = new DigitalAsset
            {
                Name = photo.FileName,
                ContentType = "image/svg+xml",
                Bytes = photo.Bytes,
                Width = photo.Width,
                Height = photo.Height,
            };
            context.DigitalAssets.Add(asset);
            addresses[photo.FileName] = $"{apiUrl}/digitalasset/serve/{asset.DigitalAssetId}";
        }
        await context.SaveChangesAsync();
        return addresses;
    }

    /// <summary>Replaces the startup seed's site content with the same content pointing at the assets.</summary>
    private static async Task SeedSiteContentAsync(CoopDbContext context, IReadOnlyDictionary<string, string> photos)
    {
        var entry = await context.JsonContents.SingleAsync(j => j.Name == SiteContentRules.Name && !j.IsDeleted);
        entry.Json = JsonSerializer.Serialize(SiteContentSeed.Create(file => photos[file]), new JsonSerializerOptions(JsonSerializerDefaults.Web));
        await context.SaveChangesAsync();
    }

    private static async Task SeedPagesAsync(CoopDbContext context, IReadOnlyDictionary<string, string> photos)
    {
        var about = new Page();
        about.Update(
            "About us",
            photos["lobby.svg"],
            "The front lobby, with a comfortable armchair beside a sunny window.",
            "<h2>Our story</h2><p>A group of older women in the neighbourhood wanted somewhere affordable to grow older among friends. They formed a co-operative, found a builder and opened the doors in 1997.</p>"
            + "<h2>How we are run</h2><p>Every member has a vote at general meetings. Members elect a board of directors from among themselves each spring, and committees look after the garden, the building and social events.</p>");
        var livingHere = new Page();
        livingHere.Update(
            "Living here",
            photos["garden.svg"],
            "A woman in a sun hat waters planters of flowers and herbs on the rooftop, the city skyline behind her.",
            "<h2>Your home</h2><p>Bachelor, one-bedroom and two-bedroom apartments, each with a balcony or a big window. Most rents are geared to income.</p>"
            + "<h2>Getting involved</h2><p>Members give a few hours a month to a committee of their choice. There is always tea in the lounge on Tuesday afternoons.</p>");
        context.Pages.AddRange(about, livingHere);
        await context.SaveChangesAsync();
    }

    /// <summary>Replaces the startup seed's board list with four directors and their portraits.</summary>
    private static async Task SeedBoardAsync(CoopDbContext context, IReadOnlyDictionary<string, string> photos)
    {
        var entry = await context.JsonContents.SingleAsync(j => j.Name == BoardOfDirectorsContent.Name && !j.IsDeleted);
        entry.Json = BoardOfDirectorsContent.Write(new[]
        {
            new DirectorDto { Name = "Margaret Lindqvist", Title = "President", PhotoUrl = photos["portrait-1.svg"] },
            new DirectorDto { Name = "Adaeze Nwosu", Title = "Vice-President", PhotoUrl = photos["portrait-2.svg"] },
            new DirectorDto { Name = "Hélène Tremblay", Title = "Treasurer", PhotoUrl = photos["portrait-3.svg"] },
            new DirectorDto { Name = "Sun-Hee Park", Title = "Secretary", PhotoUrl = photos["portrait-4.svg"] },
        });
        await context.SaveChangesAsync();
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
