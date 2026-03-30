using Coop.Application.EventSourcing.Queries.GetStoredEventById;
using Coop.Application.EventSourcing.Queries.GetStoredEvents;
using Coop.Application.EventSourcing.Queries.GetStoredEventsPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.EventSourcing;

[ApiController]
[Route("api/storedevent")]
[Authorize]
public class StoredEventController : ControllerBase
{
    private readonly IMediator _mediator;

    public StoredEventController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{storedEventId}")]
    public async Task<ActionResult<GetStoredEventByIdResponse>> GetById([FromRoute] Guid storedEventId)
        => Ok(await _mediator.Send(new GetStoredEventByIdRequest { StoredEventId = storedEventId }));

    [HttpGet]
    public async Task<ActionResult<GetStoredEventsResponse>> Get()
        => Ok(await _mediator.Send(new GetStoredEventsRequest()));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetStoredEventsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetStoredEventsPageRequest { PageSize = pageSize, Index = index }));
}
