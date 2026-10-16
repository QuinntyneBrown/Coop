// Acceptance Test
// Traces to: L2-REQ-101, L2-REQ-105
// Description: The API finds the co-op from the sub-domain of the request,
// answers 404 for an unknown or malformed co-op, and uses the default co-op
// for hosts outside the base domain.

using System.Net;
using System.Net.Http.Json;

namespace Coop.Api.Tests;

public class TenancyTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public TenancyTests(CoopApiFactory factory) => _factory = factory;

    [Fact]
    public async Task Given_the_seeded_co_op_when_a_request_reaches_its_sub_domain_then_it_is_handled()
    {
        var response = await _factory.CreateClientForCoop(CoopApiFactory.DefaultTenant).GetAsync("/api/pages");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Given_a_slug_in_capitals_when_a_request_reaches_it_then_case_is_ignored()
    {
        var response = await _factory.CreateClientForCoop("SUNRISE").GetAsync("/api/pages");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Theory]
    [InlineData("nosuchcoop")]
    [InlineData("ab")]
    [InlineData("bad_slug")]
    public async Task Given_no_co_op_has_the_slug_when_a_request_reaches_it_then_the_api_answers_404(string slug)
    {
        var response = await _factory.CreateClientForCoop(slug).GetAsync("/api/pages");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Given_an_unknown_co_op_when_a_member_signs_in_there_then_the_api_answers_404()
    {
        var client = _factory.CreateClientForCoop("nosuchcoop");

        var response = await client.PostAsync("/api/user/token", JsonContent.Create(new { username = CoopApiFactory.MemberUsername, password = CoopApiFactory.MemberPassword }));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Given_a_host_outside_the_base_domain_when_a_request_arrives_then_the_default_co_op_handles_it()
    {
        var response = await _factory.CreateAnonymousClient().GetAsync("/api/pages");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
