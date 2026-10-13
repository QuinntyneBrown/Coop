// Acceptance Test
// Traces to: L2-REQ-023, L2-REQ-024, L2-REQ-025
// Description: The office starts a received maintenance request and finishes a
// started one through the API. Each step is recorded in the audit history,
// re-posting a step returns the existing state, and skipping a step is
// rejected with a validation error.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class MaintenanceLifecycleTests : IClassFixture<CoopApiFactory>
{
    private const int Received = 1;
    private const int Started = 2;
    private const int Completed = 3;

    private readonly CoopApiFactory _factory;

    public MaintenanceLifecycleTests(CoopApiFactory factory) => _factory = factory;

    private static async Task<string> CreateRequestAsync(HttpClient client, string title)
    {
        var response = await client.PostAsJsonAsync("/api/maintenancerequest", new
        {
            title,
            description = "The kitchen tap drips all night.",
            phone = "555-0100",
            unitNumber = "101",
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("maintenanceRequest").GetProperty("maintenanceRequestId").GetString()!;
    }

    private static Task<HttpResponseMessage> TransitionAsync(HttpClient admin, string step, string maintenanceRequestId)
        => admin.PutAsJsonAsync($"/api/maintenancerequest/{step}", new { maintenanceRequestId });

    private static async Task<JsonElement> TransitionOkAsync(HttpClient admin, string step, string maintenanceRequestId)
    {
        var response = await TransitionAsync(admin, step, maintenanceRequestId);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("maintenanceRequest");
    }

    private static async Task<JsonElement[]> AuditEventsAsync(HttpClient admin, string maintenanceRequestId)
    {
        var json = await admin.GetFromJsonAsync<JsonElement>("/api/storedevent");
        return json.GetProperty("storedEvents").EnumerateArray()
            .Where(e => e.GetProperty("streamId").GetString() == maintenanceRequestId)
            .ToArray();
    }

    [Fact]
    public async Task Given_a_received_request_when_the_office_starts_then_finishes_it_then_it_is_completed_and_each_step_is_audited()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var member = await _factory.CreateMemberClientAsync();
        var id = await CreateRequestAsync(member, "Dripping kitchen tap");
        Assert.Equal(Received, (await TransitionOkAsync(admin, "receive", id)).GetProperty("status").GetInt32());

        var started = await TransitionOkAsync(admin, "start", id);
        Assert.Equal(Started, started.GetProperty("status").GetInt32());
        Assert.NotEqual(JsonValueKind.Null, started.GetProperty("startDate").ValueKind);

        var completed = await TransitionOkAsync(admin, "complete", id);
        Assert.Equal(Completed, completed.GetProperty("status").GetInt32());
        Assert.NotEqual(JsonValueKind.Null, completed.GetProperty("completeDate").ValueKind);

        var memberView = await member.GetFromJsonAsync<JsonElement>($"/api/maintenancerequest/{id}");
        Assert.Equal(Completed, memberView.GetProperty("maintenanceRequest").GetProperty("status").GetInt32());

        var events = await AuditEventsAsync(admin, id);
        Assert.Contains(events, e => e.GetProperty("aggregate").GetString() == "MaintenanceRequest"
            && e.GetProperty("data").GetString()!.Contains("\"StartedByProfileId\""));
        Assert.Contains(events, e => e.GetProperty("aggregate").GetString() == "MaintenanceRequest"
            && e.GetProperty("data").GetString()!.Contains("\"CompletedByProfileId\""));
    }

    [Fact]
    public async Task Given_a_new_request_when_finish_is_posted_then_the_api_rejects_it_with_a_validation_error()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var id = await CreateRequestAsync(admin, "Hallway light out");

        var response = await TransitionAsync(admin, "complete", id);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Only a started request can be finished.", await response.Content.ReadAsStringAsync());
        var view = await admin.GetFromJsonAsync<JsonElement>($"/api/maintenancerequest/{id}");
        Assert.Equal(0, view.GetProperty("maintenanceRequest").GetProperty("status").GetInt32());
    }

    [Fact]
    public async Task Given_a_new_request_when_start_is_posted_then_the_api_rejects_it_with_a_validation_error()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var id = await CreateRequestAsync(admin, "Courtyard gate sticks");

        var response = await TransitionAsync(admin, "start", id);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Only a received request can be started.", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Given_a_started_request_when_start_is_posted_again_then_the_existing_state_is_returned_and_audited_once()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var id = await CreateRequestAsync(admin, "Window latch loose");
        await TransitionOkAsync(admin, "receive", id);
        var first = await TransitionOkAsync(admin, "start", id);

        var second = await TransitionOkAsync(admin, "start", id);

        Assert.Equal(Started, second.GetProperty("status").GetInt32());
        Assert.Equal(first.GetProperty("startDate").GetString(), second.GetProperty("startDate").GetString());
        var starts = (await AuditEventsAsync(admin, id)).Count(e => e.GetProperty("data").GetString()!.Contains("\"StartedByProfileId\""));
        Assert.Equal(1, starts);
    }

    [Fact]
    public async Task Given_a_completed_request_when_finish_is_posted_again_then_the_existing_state_is_returned()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var id = await CreateRequestAsync(admin, "Balcony door draught");
        await TransitionOkAsync(admin, "receive", id);
        await TransitionOkAsync(admin, "start", id);
        var first = await TransitionOkAsync(admin, "complete", id);

        var second = await TransitionOkAsync(admin, "complete", id);

        Assert.Equal(Completed, second.GetProperty("status").GetInt32());
        Assert.Equal(first.GetProperty("completeDate").GetString(), second.GetProperty("completeDate").GetString());
    }
}
