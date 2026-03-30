using Coop.Application.Maintenance.Commands.CompleteMaintenanceRequest;
using Coop.Application.Maintenance.Commands.CreateMaintenanceRequest;
using Coop.Application.Maintenance.Commands.ReceiveMaintenanceRequest;
using Coop.Application.Maintenance.Commands.RemoveMaintenanceRequest;
using Coop.Application.Maintenance.Commands.StartMaintenanceRequest;
using Coop.Application.Maintenance.Commands.UpdateMaintenanceRequest;
using Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDescription;
using Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestWorkDetails;
using Coop.Application.Maintenance.Queries.GetCurrentUserMaintenanceRequests;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestById;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequests;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestsPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Maintenance;

[ApiController]
[Route("api/maintenancerequest")]
[Authorize]
public class MaintenanceRequestController : ControllerBase
{
    private readonly IMediator _mediator;

    public MaintenanceRequestController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{maintenanceRequestId}")]
    public async Task<ActionResult<GetMaintenanceRequestByIdResponse>> GetById([FromRoute] Guid maintenanceRequestId)
        => Ok(await _mediator.Send(new GetMaintenanceRequestByIdRequest { MaintenanceRequestId = maintenanceRequestId }));

    [HttpGet]
    public async Task<ActionResult<GetMaintenanceRequestsResponse>> Get()
        => Ok(await _mediator.Send(new GetMaintenanceRequestsRequest()));

    [HttpGet("my")]
    public async Task<ActionResult<GetCurrentUserMaintenanceRequestsResponse>> GetMy()
        => Ok(await _mediator.Send(new GetCurrentUserMaintenanceRequestsRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateMaintenanceRequestResponse>> Create([FromBody] CreateMaintenanceRequestRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateMaintenanceRequestResponse>> Update([FromBody] UpdateMaintenanceRequestRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut("description")]
    public async Task<ActionResult<UpdateMaintenanceRequestDescriptionResponse>> UpdateDescription([FromBody] UpdateMaintenanceRequestDescriptionRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut("work-details")]
    public async Task<ActionResult<UpdateMaintenanceRequestWorkDetailsResponse>> UpdateWorkDetails([FromBody] UpdateMaintenanceRequestWorkDetailsRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut("receive")]
    public async Task<ActionResult<ReceiveMaintenanceRequestResponse>> Receive([FromBody] ReceiveMaintenanceRequestRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut("start")]
    public async Task<ActionResult<StartMaintenanceRequestResponse>> Start([FromBody] StartMaintenanceRequestRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut("complete")]
    public async Task<ActionResult<CompleteMaintenanceRequestResponse>> Complete([FromBody] CompleteMaintenanceRequestRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{maintenanceRequestId}")]
    public async Task<ActionResult<RemoveMaintenanceRequestResponse>> Remove([FromRoute] Guid maintenanceRequestId)
        => Ok(await _mediator.Send(new RemoveMaintenanceRequestRequest { MaintenanceRequestId = maintenanceRequestId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetMaintenanceRequestsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetMaintenanceRequestsPageRequest { PageSize = pageSize, Index = index }));
}
