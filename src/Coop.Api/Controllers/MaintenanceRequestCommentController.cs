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
    [ProducesResponseType(typeof(GetMaintenanceRequestCommentById.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestCommentById.Response>> GetById([FromRoute] GetMaintenanceRequestCommentById.Request request)
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
    [ProducesResponseType(typeof(GetMaintenanceRequestComments.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestComments.Response>> Get()
        => await _mediator.Send(new GetMaintenanceRequestComments.Request());
    [HttpPost(Name = "CreateMaintenanceRequestCommentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateMaintenanceRequestComment.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateMaintenanceRequestComment.Response>> Create([FromBody] CreateMaintenanceRequestComment.Request request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetMaintenanceRequestCommentsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestCommentsPage.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestCommentsPage.Response>> Page([FromRoute] GetMaintenanceRequestCommentsPage.Request request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateMaintenanceRequestCommentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMaintenanceRequestComment.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMaintenanceRequestComment.Response>> Update([FromBody] UpdateMaintenanceRequestComment.Request request)
        => await _mediator.Send(request);
    [HttpDelete("{maintenanceRequestCommentId}", Name = "RemoveMaintenanceRequestCommentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveMaintenanceRequestComment.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveMaintenanceRequestComment.Response>> Remove([FromRoute] RemoveMaintenanceRequestComment.Request request)
        => await _mediator.Send(request);
}

