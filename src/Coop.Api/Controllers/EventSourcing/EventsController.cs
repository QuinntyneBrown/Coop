using Coop.Application.EventSourcing.Queries.GetStoredEvents;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.EventSourcing;

[ApiController]
[Route("api/events")]
[Authorize]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task GetEvents(CancellationToken cancellationToken)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("Connection", "keep-alive");

        var lastSequence = 0L;

        while (!cancellationToken.IsCancellationRequested)
        {
            var response = await _mediator.Send(new GetStoredEventsRequest(), cancellationToken);

            foreach (var se in response.StoredEvents.Where(e => e.Sequence > lastSequence))
            {
                var data = System.Text.Json.JsonSerializer.Serialize(se);
                await Response.WriteAsync($"data: {data}\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
                lastSequence = se.Sequence;
            }

            await Task.Delay(1000, cancellationToken);
        }
    }
}
