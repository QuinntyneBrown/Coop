// Acceptance Test
// Traces to: L2-REQ-114
// Description: Through the API a member reads and changes only their own
// maintenance requests, comments, conversations, messages and profiles, and
// only published documents; another household's are refused with 403, and
// the office keeps seeing everything.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class OwnerScopingTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public OwnerScopingTests(CoopApiFactory factory) => _factory = factory;

    private static async Task<string> ProfileIdAsync(HttpClient client)
        => (await client.GetFromJsonAsync<JsonElement>("/api/user/profile")).GetProperty("id").GetString()!;

    private static async Task<string> UserIdAsync(HttpClient client)
        => (await client.GetFromJsonAsync<JsonElement>("/api/user/current")).GetProperty("user").GetProperty("userId").GetString()!;

    private static async Task<JsonElement> SendRequestAsync(HttpClient client, string title, object? requestedByProfileId = null)
    {
        object body = requestedByProfileId is null
            ? new { title, description = $"{title}, please." }
            : new { title, description = $"{title}, please.", requestedByProfileId };
        var response = await client.PostAsJsonAsync("/api/maintenancerequest", body);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("maintenanceRequest");
    }

    private static async Task<string[]> RequestTitlesAsync(HttpClient client, string url)
    {
        var json = await client.GetFromJsonAsync<JsonElement>(url);
        return json.GetProperty("maintenanceRequests").EnumerateArray().Select(r => r.GetProperty("title").GetString()!).ToArray();
    }

    private static async Task<string> StartConversationAsync(HttpClient client, string subject)
    {
        var response = await client.PostAsJsonAsync("/api/conversations", new { subject, initialMessage = $"About {subject}." });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetString()!;
    }

    private static string[] ConversationIds(JsonElement json)
        => json.GetProperty("conversations").EnumerateArray().Select(c => c.GetProperty("conversationId").GetString()!).ToArray();

    [Fact]
    public async Task Given_two_households_when_a_member_lists_maintenance_requests_then_only_their_own_are_returned_and_the_office_sees_both()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();
        await SendRequestAsync(member, "Sticky balcony door");
        await SendRequestAsync(neighbour, "Dripping shower head");

        var mine = await RequestTitlesAsync(member, "/api/maintenancerequest");
        var minePage = await RequestTitlesAsync(member, "/api/maintenancerequest/page/50/0");
        var office = await RequestTitlesAsync(await _factory.CreateAdminClientAsync(), "/api/maintenancerequest");

        Assert.Contains("Sticky balcony door", mine);
        Assert.DoesNotContain("Dripping shower head", mine);
        Assert.Contains("Sticky balcony door", minePage);
        Assert.DoesNotContain("Dripping shower head", minePage);
        Assert.Contains("Sticky balcony door", office);
        Assert.Contains("Dripping shower head", office);
    }

    [Fact]
    public async Task Given_another_households_request_when_a_member_opens_it_by_id_then_the_API_refuses_with_403()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var own = await SendRequestAsync(member, "Loose stair tread");
        var theirs = await SendRequestAsync(neighbour, "Cold radiator");

        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync($"/api/maintenancerequest/{own.GetProperty("maintenanceRequestId")}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync($"/api/maintenancerequest/{theirs.GetProperty("maintenanceRequestId")}")).StatusCode);
    }

    [Fact]
    public async Task Given_a_member_sends_a_request_naming_another_profile_then_it_is_recorded_as_theirs()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();

        var created = await SendRequestAsync(member, "Window will not open", await ProfileIdAsync(neighbour));

        Assert.Equal(await ProfileIdAsync(member), created.GetProperty("requestedByProfileId").GetString());
    }

    [Fact]
    public async Task Given_comments_on_two_households_requests_when_a_member_lists_comments_then_only_those_on_their_requests_are_returned()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var own = (await SendRequestAsync(member, "Noisy fan")).GetProperty("maintenanceRequestId").GetString();
        var theirs = (await SendRequestAsync(neighbour, "Squeaky gate")).GetProperty("maintenanceRequestId").GetString();
        Assert.Equal(HttpStatusCode.OK, (await member.PostAsJsonAsync("/api/maintenancerequestcomment", new { maintenanceRequestId = own, body = "It rattles at night." })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await neighbour.PostAsJsonAsync("/api/maintenancerequestcomment", new { maintenanceRequestId = theirs, body = "Private note from next door." })).StatusCode);

        var refused = await member.PostAsJsonAsync("/api/maintenancerequestcomment", new { maintenanceRequestId = theirs, body = "Not mine to write on." });
        var comments = (await member.GetFromJsonAsync<JsonElement>("/api/maintenancerequestcomment"))
            .GetProperty("maintenanceRequestComments").EnumerateArray().Select(c => c.GetProperty("body").GetString()).ToArray();

        Assert.Equal(HttpStatusCode.Forbidden, refused.StatusCode);
        Assert.Contains("It rattles at night.", comments);
        Assert.DoesNotContain("Private note from next door.", comments);
    }

    [Fact]
    public async Task Given_two_households_conversations_when_a_member_lists_by_the_empty_profile_then_only_their_own_are_returned()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var own = await StartConversationAsync(member, "Garden plot");
        var theirs = await StartConversationAsync(neighbour, "Parking space");

        var mine = ConversationIds(await member.GetFromJsonAsync<JsonElement>($"/api/conversations/by-profile/{Guid.Empty}"));
        var office = ConversationIds(await (await _factory.CreateAdminClientAsync()).GetFromJsonAsync<JsonElement>($"/api/conversations/by-profile/{Guid.Empty}"));

        Assert.Contains(own, mine);
        Assert.DoesNotContain(theirs, mine);
        Assert.Contains(own, office);
        Assert.Contains(theirs, office);
    }

    [Fact]
    public async Task Given_another_households_conversation_when_a_member_reads_or_writes_to_it_then_the_API_refuses_with_403()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var theirs = await StartConversationAsync(neighbour, "Laundry room");
        var own = await StartConversationAsync(member, "Bike storage");

        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync($"/api/conversations/by-profile/{await ProfileIdAsync(neighbour)}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync($"/api/conversations/{theirs}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync($"/api/messages/by-conversation/{theirs}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.PostAsJsonAsync($"/api/conversations/{theirs}/messages", new { content = "Hello?" })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync($"/api/conversations/{own}")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync($"/api/messages/by-conversation/{own}")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.PostAsJsonAsync($"/api/conversations/{own}/messages", new { content = "Thank you." })).StatusCode);
    }

    [Fact]
    public async Task Given_a_member_when_they_start_a_conversation_without_naming_themselves_then_they_take_part_in_it()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();

        var response = await member.PostAsJsonAsync("/api/conversations/create", new { profileIds = new[] { await ProfileIdAsync(neighbour) } });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var profileIds = (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("conversation").GetProperty("profileIds").EnumerateArray().Select(p => p.GetString()).ToArray();
        Assert.Contains(await ProfileIdAsync(member), profileIds);
    }

    [Fact]
    public async Task Given_two_households_profiles_when_a_member_reads_profiles_then_only_their_own_are_returned()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();
        var memberUserId = await UserIdAsync(member);

        var profiles = (await member.GetFromJsonAsync<JsonElement>("/api/profiles")).GetProperty("profiles").EnumerateArray().ToArray();

        Assert.NotEmpty(profiles);
        Assert.All(profiles, p => Assert.Equal(memberUserId, p.GetProperty("userId").GetString()));
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync($"/api/profiles/{await ProfileIdAsync(member)}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync($"/api/profiles/{await ProfileIdAsync(neighbour)}")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync($"/api/profiles/by-user/{await UserIdAsync(neighbour)}")).StatusCode);
        Assert.True((await (await _factory.CreateAdminClientAsync()).GetFromJsonAsync<JsonElement>("/api/profiles")).GetProperty("profiles").GetArrayLength() > profiles.Length);
    }

    [Fact]
    public async Task Given_a_member_when_they_change_member_profiles_then_only_their_own_may_be_changed_and_a_new_one_is_theirs()
    {
        var member = await _factory.CreateMemberClientAsync();
        var neighbour = await _factory.CreateNeighbourClientAsync();

        var theirs = await member.PutAsJsonAsync("/api/members", new { profileId = await ProfileIdAsync(neighbour), firstname = "Changed", lastname = "ByOthers" });
        var own = await member.PutAsJsonAsync("/api/members", new { profileId = await ProfileIdAsync(member), firstname = "Test", lastname = "Member", unitNumber = "101" });
        var created = await member.PostAsJsonAsync("/api/members", new { userId = await UserIdAsync(neighbour), firstname = "Second", lastname = "Profile" });

        Assert.Equal(HttpStatusCode.Forbidden, theirs.StatusCode);
        Assert.Equal(HttpStatusCode.OK, own.StatusCode);
        Assert.Equal(HttpStatusCode.OK, created.StatusCode);
        var createdUserId = (await created.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("member").GetProperty("userId").GetString();
        Assert.Equal(await UserIdAsync(member), createdUserId);
    }

    [Fact]
    public async Task Given_a_draft_and_a_published_document_when_a_member_reads_documents_then_only_the_published_one_is_returned()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var member = await _factory.CreateMemberClientAsync();
        var draft = (await (await admin.PostAsJsonAsync("/api/notice", new { name = "Draft budget notice", body = "Not ready yet." })).Content.ReadFromJsonAsync<JsonElement>()).GetProperty("notice").GetProperty("documentId").GetString();
        var published = (await (await admin.PostAsJsonAsync("/api/notice", new { name = "Fire drill on Friday", body = "Meet in the courtyard." })).Content.ReadFromJsonAsync<JsonElement>()).GetProperty("notice").GetProperty("documentId").GetString();
        Assert.Equal(HttpStatusCode.OK, (await admin.PutAsJsonAsync("/api/document/publish", new { documentId = published })).StatusCode);

        var names = (await member.GetFromJsonAsync<JsonElement>("/api/document")).GetProperty("documents").EnumerateArray().Select(d => d.GetProperty("name").GetString()).ToArray();
        var officeNames = (await admin.GetFromJsonAsync<JsonElement>("/api/document")).GetProperty("documents").EnumerateArray().Select(d => d.GetProperty("name").GetString()).ToArray();

        Assert.Contains("Fire drill on Friday", names);
        Assert.DoesNotContain("Draft budget notice", names);
        Assert.Contains("Draft budget notice", officeNames);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync($"/api/document/{draft}")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync($"/api/document/{published}")).StatusCode);
    }
}
