using System.Security.Cryptography;
using System.Text.Json;
using Coop.Application.CMS.Board;
using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.SiteContent;
using Coop.Domain.Assets;
using Coop.Domain.CMS;
using Coop.Domain.Documents;
using Coop.Domain.Maintenance;
using Coop.Domain.Messaging;
using Coop.Domain.Onboarding;
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
        await SeedMaintenanceAsync(context);
        await SeedDocumentsAsync(context);
        await SeedMessagesAsync(context);
        await SeedThemeAsync(context);
        await SeedInvitationsAsync(context);
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

    /// <summary>One request in each status, from the member, with comments from the member and the office (L2-REQ-103 AC6).</summary>
    private static async Task SeedMaintenanceAsync(CoopDbContext context)
    {
        var member = await context.Members.SingleAsync(m => m.Lastname == "Okafor");
        var office = await context.StaffMembers.SingleAsync(s => s.Lastname == "Raman");
        // A maintenance photo is private to the household and the office, so it is its own asset, not a public one.
        var lobby = await context.DigitalAssets.AsNoTracking().SingleAsync(a => a.Name == "lobby.svg");
        var lobbyPhoto = new DigitalAsset { Name = "lobby-light.svg", ContentType = lobby.ContentType, Bytes = lobby.Bytes, Width = lobby.Width, Height = lobby.Height };
        context.DigitalAssets.Add(lobbyPhoto);

        MaintenanceRequest Request(string title, string description, string comment)
        {
            var request = new MaintenanceRequest
            {
                RequestedByProfileId = member.ProfileId,
                RequestedByName = member.Fullname,
                Title = title,
                Description = description,
                Phone = member.PhoneNumber,
                UnitNumber = member.UnitNumber,
            };
            request.Comments.Add(new MaintenanceRequestComment { MaintenanceRequestId = request.MaintenanceRequestId, CreatedByProfileId = member.ProfileId, Body = comment });
            context.MaintenanceRequests.Add(request);
            return request;
        }

        void OfficeComment(MaintenanceRequest request, string body)
            => request.Comments.Add(new MaintenanceRequestComment { MaintenanceRequestId = request.MaintenanceRequestId, CreatedByProfileId = office.ProfileId, Body = body });

        Request("Kitchen tap drips", "The cold tap in the kitchen drips all night, even when it is turned off tight.", "Mornings are best for me to let someone in.");

        var light = Request("Lobby light flickering", "The ceiling light by the mailboxes flickers on and off in the evening.", "It is worst after dark, when the lobby is busy.");
        light.DigitalAssets.Add(new MaintenanceRequestDigitalAsset { MaintenanceRequestId = light.MaintenanceRequestId, DigitalAssetId = lobbyPhoto.DigitalAssetId });
        light.Receive(office.ProfileId);
        OfficeComment(light, "Thank you, Rosalind. The electrician is booked for Thursday.");

        var balcony = Request("Balcony door sticks", "The balcony door is hard to slide open and closed.", "I need both hands to open it.");
        balcony.Receive(office.ProfileId);
        balcony.WorkDetails = "Clean and adjust the door rollers.";
        context.StoredEvents.Add(balcony.Start(office.ProfileId));
        OfficeComment(balcony, "Our handyperson has started and will finish tomorrow.");

        var radiator = Request("Bedroom radiator cold", "The radiator in the bedroom stays cold when the heat is on.", "The living room radiator works fine.");
        radiator.Receive(office.ProfileId);
        radiator.WorkDetails = "Bled the radiator and checked the valve. It heats up evenly now.";
        context.StoredEvents.Add(radiator.Start(office.ProfileId));
        context.StoredEvents.Add(radiator.Complete(office.ProfileId));
        OfficeComment(radiator, "All done. Please let us know if it goes cold again.");

        await context.SaveChangesAsync();
    }

    /// <summary>Published and draft notices, bylaws and reports.</summary>
    private static async Task SeedDocumentsAsync(CoopDbContext context)
    {
        var windows = new Notice { Name = "Window cleaning on Tuesday", Body = "Window cleaners will be on the building from 9 am to 3 pm on Tuesday. Please close your blinds if you would like privacy." };
        windows.Publish();
        var meeting = new Notice { Name = "Annual general meeting", Body = "Our annual general meeting is in the lounge on the first Saturday of next month at 2 pm. Tea and cake to follow." };
        meeting.Publish();
        var garden = new Notice { Name = "Garden committee sign-up", Body = "The garden committee is looking for new members for the spring planting." };

        var occupancy = new ByLaw { Name = "Occupancy bylaw" };
        occupancy.Publish();
        var pets = new ByLaw { Name = "Pet bylaw (draft revision)" };

        var annual = new Report { Name = "2025 annual report", Body = "A summary of the co-op's year: repairs completed, finances and the work of each committee." };
        annual.Publish();
        var budget = new Report { Name = "2027 budget (draft)", Body = "The board's draft budget for members to discuss at the general meeting." };

        context.Notices.AddRange(windows, meeting, garden);
        context.ByLaws.AddRange(occupancy, pets);
        context.Reports.AddRange(annual, budget);
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// A conversation between the member and the office. The admin app reads
    /// the office's conversations under the empty profile id.
    /// </summary>
    private static async Task SeedMessagesAsync(CoopDbContext context)
    {
        var member = await context.Members.SingleAsync(m => m.Lastname == "Okafor");
        var office = Guid.Empty;
        var conversation = new Conversation();
        conversation.Profiles.Add(new ConversationProfile { ConversationId = conversation.ConversationId, ProfileId = member.ProfileId });
        conversation.Profiles.Add(new ConversationProfile { ConversationId = conversation.ConversationId, ProfileId = office });

        Message Say(Guid from, Guid to, string body, bool read)
        {
            var message = new Message { ConversationId = conversation.ConversationId, FromProfileId = from, ToProfileId = to, Body = body, Read = read };
            conversation.Messages.Add(message);
            return message;
        }

        Say(member.ProfileId, office, "Hello, could I book the guest suite for my sister on the 14th and 15th?", true);
        Say(office, member.ProfileId, "Hello Rosalind, the guest suite is free on those nights. I have put your name down.", true);
        Say(member.ProfileId, office, "Thank you so much. Where do I pick up the key?", false);

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();
    }

    /// <summary>The default theme, in the form the admin Settings screen saves.</summary>
    private static async Task SeedThemeAsync(CoopDbContext context)
    {
        context.Themes.Add(new Theme
        {
            CssCustomProperties = "--primary-color: #3D8A5A; --background-color: #F5F4F1; --accent-color: #3D8A5A; --text-color: #1A1918",
            IsDefault = true,
        });
        await context.SaveChangesAsync();
    }

    /// <summary>An invitation for a new board member, beside the startup seed's member invitations.</summary>
    private static async Task SeedInvitationsAsync(CoopDbContext context)
    {
        context.InvitationTokens.Add(new InvitationToken
        {
            Value = "board-welcome-2027",
            Type = InvitationTokenType.BoardMember,
            ExpirationDate = new DateTime(2027, 6, 30, 0, 0, 0, DateTimeKind.Utc),
        });
        await context.SaveChangesAsync();
    }
}
