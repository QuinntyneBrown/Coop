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
public class MaintenanceRequestCommentController
{
    private readonly IMediator _mediator;
    public MaintenanceRequestCommentController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{maintenanceRequestCommentId}", Name = "GetMaintenanceRequestCommentByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestCommentByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestCommentByIdResponse>> GetById([FromRoute] GetMaintenanceRequestCommentByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.MaintenanceRequestComment == null)
        {
            return new NotFoundObjectResult(request.MaintenanceRequestCommentId);
        }
        return response;
    }
    [HttpGet(Name = "GetMaintenanceRequestCommentsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestCommentsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestCommentsResponse>> Get()
        => await _mediator.Send(new GetMaintenanceRequestCommentsRequest());
    [HttpPost(Name = "CreateMaintenanceRequestCommentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateMaintenanceRequestCommentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateMaintenanceRequestCommentResponse>> Create([FromBody] CreateMaintenanceRequestCommentRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetMaintenanceRequestCommentsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestCommentsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestCommentsPageResponse>> Page([FromRoute] GetMaintenanceRequestCommentsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateMaintenanceRequestCommentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMaintenanceRequestCommentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMaintenanceRequestCommentResponse>> Update([FromBody] UpdateMaintenanceRequestCommentRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{maintenanceRequestCommentId}", Name = "RemoveMaintenanceRequestCommentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveMaintenanceRequestCommentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveMaintenanceRequestCommentResponse>> Remove([FromRoute] RemoveMaintenanceRequestCommentRequest request)
        => await _mediator.Send(request);
}

