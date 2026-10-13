using Coop.Application.Maintenance.Commands.AddMaintenanceRequestPhoto;
using Coop.Application.Maintenance.Queries.GetMaintenanceRequestPhoto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Maintenance;

[ApiController]
[Route("api/maintenance-requests/{maintenanceRequestId}/photos")]
[Authorize]
public class MaintenanceRequestPhotosController : ControllerBase
{
    private readonly IMediator _mediator;

    public MaintenanceRequestPhotosController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<ActionResult<AddMaintenanceRequestPhotoResponse>> Add([FromRoute] Guid maintenanceRequestId, IFormFile file)
        => Ok(await _mediator.Send(new AddMaintenanceRequestPhotoRequest { MaintenanceRequestId = maintenanceRequestId, File = file }));

    [HttpGet("{photoId}")]
    public async Task<IActionResult> Get([FromRoute] Guid maintenanceRequestId, [FromRoute] Guid photoId)
    {
        var response = await _mediator.Send(new GetMaintenanceRequestPhotoRequest { MaintenanceRequestId = maintenanceRequestId, PhotoId = photoId });
        return File(response.Bytes, response.ContentType);
    }
}
