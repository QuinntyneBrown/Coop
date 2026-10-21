// Acceptance Test
// Traces to: L2-REQ-102, L2-REQ-108
// Description: The public BFF keeps its anonymous endpoints and the ones the
// admin app calls, and no longer serves the endpoints only the removed public
// member pages called (ADR 0012).

using System.Net;
using System.Net.Http.Json;

namespace Coop.Api.Tests;

public class PublicBffTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public PublicBffTests(CoopApiFactory factory) => _factory = factory;

    public static TheoryData<string, string> RetiredEndpoints => new()
    {
        { "GET", "/api/user/profiles" },
        { "POST", "/api/user/change-password" },
        { "GET", "/api/user/members" },
        { "GET", "/api/maintenance-requests/my" },
        { "POST", "/api/maintenance-requests" },
        { "GET", "/api/maintenance-requests/6f1c2b9e-5d1a-4c3e-9b7a-0e2f4d6a8c10" },
        { "DELETE", "/api/maintenance-requests/6f1c2b9e-5d1a-4c3e-9b7a-0e2f4d6a8c10" },
        { "POST", "/api/maintenance-requests/6f1c2b9e-5d1a-4c3e-9b7a-0e2f4d6a8c10/comments" },
        { "POST", "/api/documents" },
        { "DELETE", "/api/documents/6f1c2b9e-5d1a-4c3e-9b7a-0e2f4d6a8c10" },
        { "GET", "/api/conversations" },
        { "GET", "/api/conversations/6f1c2b9e-5d1a-4c3e-9b7a-0e2f4d6a8c10/messages" },
    };

    [Theory]
    [MemberData(nameof(RetiredEndpoints))]
    public async Task Given_the_public_member_pages_are_gone_when_their_endpoint_is_called_then_the_API_no_longer_serves_it(string method, string url)
    {
        var admin = await _factory.CreateAdminClientAsync();
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        if (method is "POST")
            request.Content = JsonContent.Create(new { });

        var response = await admin.SendAsync(request);

        // Not found, not allowed for the method, or (for api/user/{userId}) not an id.
        Assert.Contains(response.StatusCode, new[] { HttpStatusCode.NotFound, HttpStatusCode.MethodNotAllowed, HttpStatusCode.BadRequest });
    }

    [Fact]
    public async Task Given_the_endpoints_that_remain_when_they_are_called_then_they_answer()
    {
        var anonymous = _factory.CreateAnonymousClient();
        var member = await _factory.CreateMemberClientAsync();

        Assert.Equal(HttpStatusCode.OK, (await anonymous.GetAsync("/api/documents")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await anonymous.GetAsync("/api/board-members")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.GetAsync("/api/user/profile")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.PutAsJsonAsync("/api/user/profile", new { noticeByEmail = true })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await member.PostAsJsonAsync("/api/conversations", new { subject = "Hello", initialMessage = "Hello office." })).StatusCode);
    }
}
