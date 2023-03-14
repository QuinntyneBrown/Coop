// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Coop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MaintenanceRequestController
{
    private readonly IMediator _mediator;
    private readonly ILogger<MaintenanceRequestController> _logger;
    public MaintenanceRequestController(IMediator mediator, ILogger<MaintenanceRequestController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    [HttpGet("{maintenanceRequestId}", Name = "GetMaintenanceRequestByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestByIdResponse>> GetById([FromRoute] GetMaintenanceRequestByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.MaintenanceRequest == null)
        {
            return new NotFoundObjectResult(request.MaintenanceRequestId);
        }
        return response;
    }
    [HttpGet("my", Name = "GetCurrentUserMaintenanceRequestsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetCurrentUserMaintenanceRequestsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetCurrentUserMaintenanceRequestsResponse>> GetByCurrentProfile()
    {
        return await _mediator.Send(new GetCurrentUserMaintenanceRequestsRequest());
    }
    [HttpGet(Name = "GetMaintenanceRequestsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestsResponse>> Get()
    {
        return await _mediator.Send(new GetMaintenanceRequestsRequest());
    }
    [HttpGet("page/{pageSize}/{index}", Name = "GetMaintenanceRequestsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestsPageResponse>> Page([FromRoute] GetMaintenanceRequestsPageRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpDelete("{maintenanceRequestId}", Name = "RemoveMaintenanceRequestRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveMaintenanceRequestResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveMaintenanceRequestResponse>> Remove([FromRoute] RemoveMaintenanceRequestRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpPost(Name = "CreateMaintenanceRequestRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateMaintenanceRequestResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateMaintenanceRequestResponse>> Create([FromBody] CreateMaintenanceRequestRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpPut(Name = "UpdateMaintenanceRequestRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMaintenanceRequestResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMaintenanceRequestResponse>> Update([FromBody] UpdateMaintenanceRequestRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpPut("description", Name = "UpdateMaintenanceRequestDescriptionRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMaintenanceRequestDescriptionResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMaintenanceRequestDescriptionResponse>> Update([FromBody] UpdateMaintenanceRequestDescriptionRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpPut("work-details", Name = "UpdateMaintenanceRequestWorkDetailsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMaintenanceRequestWorkDetailsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMaintenanceRequestWorkDetailsResponse>> UpdateWorkDetails([FromBody] UpdateMaintenanceRequestWorkDetailsRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpPut("start", Name = "StartMaintenanceRequestRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(StartMaintenanceRequestResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<StartMaintenanceRequestResponse>> Start([FromBody] StartMaintenanceRequestRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpPut("receive", Name = "ReceiveMaintenanceRequestRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(ReceiveMaintenanceRequestResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<ReceiveMaintenanceRequestResponse>> Receive([FromBody] ReceiveMaintenanceRequestRequest request)
    {
        return await _mediator.Send(request);
    }
    [HttpPut("complete", Name = "CompleteMaintenanceRequestRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CompleteMaintenanceRequestResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CompleteMaintenanceRequestResponse>> Complete([FromBody] CompleteMaintenanceRequestRequest request)
    {
        return await _mediator.Send(request);
    }
}

