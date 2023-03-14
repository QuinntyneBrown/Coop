// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using System.Threading.Tasks;
using Coop.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OnCallController
{
    private readonly IMediator _mediator;
    public OnCallController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{onCallId}", Name = "GetOnCallByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetOnCallByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetOnCallByIdResponse>> GetById([FromRoute] GetOnCallByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.OnCall == null)
        {
            return new NotFoundObjectResult(request.OnCallId);
        }
        return response;
    }
    [HttpGet(Name = "GetOnCallsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetOnCallsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetOnCallsResponse>> Get()
        => await _mediator.Send(new GetOnCallsRequest());
    [HttpGet("page/{pageSize}/{index}", Name = "GetOnCallsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetOnCallsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetOnCallsPageResponse>> Page([FromRoute] GetOnCallsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateOnCallRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateOnCallResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateOnCallResponse>> Update([FromBody] UpdateOnCallRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{onCallId}", Name = "RemoveOnCallRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveOnCallResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveOnCallResponse>> Remove([FromRoute] RemoveOnCallRequest request)
        => await _mediator.Send(request);
}

