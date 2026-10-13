using Coop.Application.Maintenance.Commands.CreateMaintenanceRequestComment;
using Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestComment;
using Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestComment;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentById;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestComments;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentsPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Maintenance;

[ApiController]
[Route("api/maintenancerequestcomment")]
[Authorize]
public class MaintenanceRequestCommentController : ControllerBase
{
    private readonly IMediator _mediator;

    public MaintenanceRequestCommentController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{maintenanceRequestCommentId}")]
    public async Task<ActionResult<GetMaintenanceRequestCommentByIdResponse>> GetById([FromRoute] Guid maintenanceRequestCommentId)
        => Ok(await _mediator.Send(new GetMaintenanceRequestCommentByIdRequest { MaintenanceRequestCommentId = maintenanceRequestCommentId }));

    [HttpGet]
    public async Task<ActionResult<GetMaintenanceRequestCommentsResponse>> Get()
        => Ok(await _mediator.Send(new GetMaintenanceRequestCommentsRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateMaintenanceRequestCommentResponse>> Create([FromBody] CreateMaintenanceRequestCommentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateMaintenanceRequestCommentResponse>> Update([FromBody] UpdateMaintenanceRequestCommentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{maintenanceRequestCommentId}")]
    public async Task<ActionResult<RemoveMaintenanceRequestCommentResponse>> Remove([FromRoute] Guid maintenanceRequestCommentId)
        => Ok(await _mediator.Send(new RemoveMaintenanceRequestCommentRequest { MaintenanceRequestCommentId = maintenanceRequestCommentId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetMaintenanceRequestCommentsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetMaintenanceRequestCommentsPageRequest { PageSize = pageSize, Index = index }));
}
