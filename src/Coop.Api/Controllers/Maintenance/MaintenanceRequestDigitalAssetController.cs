using Coop.Application.Maintenance.Commands.CreateMaintenanceRequestDigitalAsset;
using Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestDigitalAsset;
using Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDigitalAsset;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetById;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssets;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetsPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Maintenance;

[ApiController]
[Route("api/maintenancerequestdigitalasset")]
[Authorize]
public class MaintenanceRequestDigitalAssetController : ControllerBase
{
    private readonly IMediator _mediator;

    public MaintenanceRequestDigitalAssetController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{maintenanceRequestDigitalAssetId}")]
    public async Task<ActionResult<GetMaintenanceRequestDigitalAssetByIdResponse>> GetById([FromRoute] Guid maintenanceRequestDigitalAssetId)
        => Ok(await _mediator.Send(new GetMaintenanceRequestDigitalAssetByIdRequest { MaintenanceRequestDigitalAssetId = maintenanceRequestDigitalAssetId }));

    [HttpGet]
    public async Task<ActionResult<GetMaintenanceRequestDigitalAssetsResponse>> Get()
        => Ok(await _mediator.Send(new GetMaintenanceRequestDigitalAssetsRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateMaintenanceRequestDigitalAssetResponse>> Create([FromBody] CreateMaintenanceRequestDigitalAssetRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateMaintenanceRequestDigitalAssetResponse>> Update([FromBody] UpdateMaintenanceRequestDigitalAssetRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{maintenanceRequestDigitalAssetId}")]
    public async Task<ActionResult<RemoveMaintenanceRequestDigitalAssetResponse>> Remove([FromRoute] Guid maintenanceRequestDigitalAssetId)
        => Ok(await _mediator.Send(new RemoveMaintenanceRequestDigitalAssetRequest { MaintenanceRequestDigitalAssetId = maintenanceRequestDigitalAssetId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetMaintenanceRequestDigitalAssetsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetMaintenanceRequestDigitalAssetsPageRequest { PageSize = pageSize, Index = index }));
}
