// Acceptance Test
// Traces to: L2-REQ-021
// Description: When a member sends a maintenance request, the request records
// the member's name from their profile, so the office sees who sent it.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class MaintenanceSubmitterTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public MaintenanceSubmitterTests(CoopApiFactory factory) => _factory = factory;

    [Fact]
    public async Task Given_a_member_sends_a_request_when_the_office_opens_it_then_it_shows_the_members_name()
    {
        var member = await _factory.CreateNeighbourClientAsync();
        var created = await member.PostAsJsonAsync("/api/maintenancerequest", new { title = "Loose railing", description = "The stair railing moves." });
        Assert.Equal(HttpStatusCode.OK, created.StatusCode);
        var requestId = (await created.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("maintenanceRequest").GetProperty("maintenanceRequestId").GetString();

        var admin = await _factory.CreateAdminClientAsync();
        var office = await admin.GetFromJsonAsync<JsonElement>($"/api/maintenancerequest/{requestId}");

        Assert.Equal("Nora Neighbour", office.GetProperty("maintenanceRequest").GetProperty("requestedByName").GetString());
    }
}
