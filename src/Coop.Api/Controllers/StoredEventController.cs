// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using System.Threading.Tasks;
using Coop.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StoredEventController
{
    private readonly IMediator _mediator;
    public StoredEventController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{storedEventId}", Name = "GetStoredEventByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetStoredEventByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetStoredEventByIdResponse>> GetById([FromRoute] GetStoredEventByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.StoredEvent == null)
        {
            return new NotFoundObjectResult(request.StoredEventId);
        }
        return response;
    }
    [HttpGet(Name = "GetStoredEventsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetStoredEventsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetStoredEventsResponse>> Get()
        => await _mediator.Send(new GetStoredEventsRequest());
    [HttpPost(Name = "CreateStoredEventRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateStoredEventResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateStoredEventResponse>> Create([FromBody] CreateStoredEventRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetStoredEventsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetStoredEventsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetStoredEventsPageResponse>> Page([FromRoute] GetStoredEventsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateStoredEventRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateStoredEventResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateStoredEventResponse>> Update([FromBody] UpdateStoredEventRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{storedEventId}", Name = "RemoveStoredEventRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveStoredEventResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveStoredEventResponse>> Remove([FromRoute] RemoveStoredEventRequest request)
        => await _mediator.Send(request);
}

