// Acceptance Test
// Traces to: L2-REQ-105, L2-REQ-103
// Description: A signed-in member is refused (403) every request of an office
// area, even with the admin app bypassed; the office keeps its access, and
// registering with an invitation stays anonymous.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class OfficeAreasTests : IClassFixture<CoopApiFactory>
{
    private const string AnyId = "6f1c2b9e-5d1a-4c3e-9b7a-0e2f4d6a8c10";

    private readonly CoopApiFactory _factory;

    public OfficeAreasTests(CoopApiFactory factory) => _factory = factory;

    public static TheoryData<string, string> OfficeRequests => new()
    {
        // Users, roles and privileges
        { "GET", "/api/user" },
        { "GET", "/api/user/page/10/0" },
        { "GET", $"/api/user/{AnyId}" },
        { "POST", "/api/user" },
        { "PUT", "/api/user" },
        { "PUT", "/api/user/password/reset" },
        { "DELETE", $"/api/user/{AnyId}" },
        { "GET", "/api/role" },
        { "POST", "/api/role" },
        { "DELETE", $"/api/role/{AnyId}" },
        { "GET", "/api/privilege" },
        { "POST", "/api/privilege" },
        // Invitations
        { "GET", "/api/invitationtoken" },
        { "GET", "/api/invitationtoken/page/10/0" },
        { "POST", "/api/invitationtoken" },
        { "DELETE", $"/api/invitationtoken/{AnyId}" },
        // Digital asset management
        { "GET", "/api/digitalasset/page/10/0" },
        { "GET", $"/api/digitalasset/{AnyId}" },
        { "DELETE", $"/api/digitalasset/{AnyId}" },
        // Profiles management
        { "GET", "/api/members" },
        { "GET", $"/api/members/{AnyId}" },
        { "GET", "/api/staffmembers" },
        { "POST", "/api/staffmembers" },
        { "POST", "/api/boardmembers" },
        { "PUT", "/api/boardmembers" },
        { "DELETE", $"/api/profiles/{AnyId}" },
        // Documents: drafts and changes
        { "GET", "/api/notice" },
        { "GET", "/api/bylaw" },
        { "GET", "/api/report/page/10/0" },
        { "POST", "/api/notice" },
        { "POST", "/api/document" },
        { "PUT", "/api/document" },
        { "PUT", "/api/document/publish" },
        { "DELETE", $"/api/document/{AnyId}" },
        { "DELETE", $"/api/notice/{AnyId}" },
        // Themes and JSON content
        { "POST", "/api/theme" },
        { "PUT", "/api/theme" },
        { "POST", "/api/jsoncontent" },
        // Audit trail
        { "GET", "/api/storedevent" },
        // Maintenance office work
        { "PUT", "/api/maintenancerequest" },
        { "PUT", "/api/maintenancerequest/description" },
        { "PUT", "/api/maintenancerequest/work-details" },
        { "PUT", "/api/maintenancerequest/receive" },
        { "PUT", "/api/maintenancerequest/start" },
        { "PUT", "/api/maintenancerequest/complete" },
        { "DELETE", $"/api/maintenancerequest/{AnyId}" },
        { "GET", "/api/maintenancerequestdigitalasset" },
        { "POST", "/api/maintenancerequestdigitalasset" },
        { "PUT", "/api/maintenancerequestcomment" },
        { "DELETE", $"/api/maintenancerequestcomment/{AnyId}" },
        // Removing conversations and messages
        { "DELETE", $"/api/conversations/{AnyId}" },
        { "DELETE", $"/api/messages/{AnyId}" },
    };

    private static HttpRequestMessage Request(string method, string url)
    {
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        if (method is "POST" or "PUT")
            request.Content = JsonContent.Create(new { });
        return request;
    }

    [Theory]
    [MemberData(nameof(OfficeRequests))]
    public async Task Given_a_member_when_they_call_an_office_request_then_the_API_refuses_with_403(string method, string url)
    {
        var member = await _factory.CreateMemberClientAsync();

        var response = await member.SendAsync(Request(method, url));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("Access denied.", body.GetProperty("message").GetString());
    }

    [Theory]
    [InlineData("/api/user")]
    [InlineData("/api/role")]
    [InlineData("/api/privilege")]
    [InlineData("/api/invitationtoken")]
    [InlineData("/api/digitalasset/page/10/0")]
    [InlineData("/api/members")]
    [InlineData("/api/notice")]
    [InlineData("/api/storedevent")]
    public async Task Given_the_office_when_it_reads_an_office_area_then_the_API_answers_as_before(string url)
    {
        var admin = await _factory.CreateAdminClientAsync();
        var staff = await _factory.CreateStaffClientAsync();

        Assert.Equal(HttpStatusCode.OK, (await admin.GetAsync(url)).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await staff.GetAsync(url)).StatusCode);
    }

    [Fact]
    public async Task Given_staff_when_they_create_and_remove_an_invitation_then_it_works_as_before()
    {
        var staff = await _factory.CreateStaffClientAsync();

        var created = await staff.PostAsJsonAsync("/api/invitationtoken", new { value = "staff-made-token", type = 0 });

        Assert.Equal(HttpStatusCode.OK, created.StatusCode);
    }

    [Fact]
    public async Task Given_a_member_when_they_call_their_own_endpoints_then_the_API_answers()
    {
        var member = await _factory.CreateMemberClientAsync();

        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync("/api/user/current")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync("/api/user/profile")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync("/api/maintenancerequest")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync("/api/document")).StatusCode);
    }

    [Fact]
    public async Task Given_no_token_when_an_office_request_is_called_then_the_API_answers_401()
    {
        var anonymous = _factory.CreateAnonymousClient();

        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/user")).StatusCode);
    }

    [Fact]
    public async Task Given_a_valid_invitation_when_someone_registers_without_signing_in_then_the_account_is_created_and_signed_in()
    {
        var anonymous = _factory.CreateAnonymousClient();

        var response = await anonymous.PostAsJsonAsync("/api/user/register", new { invitationToken = "valid-invitation-token", username = "rosa.new", password = "Rosa1234!" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.False(string.IsNullOrEmpty(body.GetProperty("accessToken").GetString()));
        Assert.Equal("rosa.new", body.GetProperty("username").GetString());
        var signedIn = await _factory.CreateClientAsAsync("rosa.new", "Rosa1234!");
        Assert.Equal(HttpStatusCode.OK, (await signedIn.GetAsync("/api/user/current")).StatusCode);
    }

    [Fact]
    public async Task Given_an_invalid_invitation_when_someone_registers_then_the_API_answers_400()
    {
        var anonymous = _factory.CreateAnonymousClient();

        var response = await anonymous.PostAsJsonAsync("/api/user/register", new { invitationToken = "no-such-token", username = "nobody.here", password = "Nobody123!" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
