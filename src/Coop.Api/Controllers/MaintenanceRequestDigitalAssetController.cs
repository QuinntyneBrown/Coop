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
public class MaintenanceRequestDigitalAssetController
{
    private readonly IMediator _mediator;
    public MaintenanceRequestDigitalAssetController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{maintenanceRequestDigitalAssetId}", Name = "GetMaintenanceRequestDigitalAssetByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestDigitalAssetByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestDigitalAssetByIdResponse>> GetById([FromRoute] GetMaintenanceRequestDigitalAssetByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.MaintenanceRequestDigitalAsset == null)
        {
            return new NotFoundObjectResult(request.MaintenanceRequestDigitalAssetId);
        }
        return response;
    }
    [HttpGet(Name = "GetMaintenanceRequestDigitalAssetsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestDigitalAssetsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestDigitalAssetsResponse>> Get()
        => await _mediator.Send(new GetMaintenanceRequestDigitalAssetsRequest());
    [HttpPost(Name = "CreateMaintenanceRequestDigitalAssetRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateMaintenanceRequestDigitalAssetResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateMaintenanceRequestDigitalAssetResponse>> Create([FromBody] CreateMaintenanceRequestDigitalAssetRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetMaintenanceRequestDigitalAssetsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMaintenanceRequestDigitalAssetsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMaintenanceRequestDigitalAssetsPageResponse>> Page([FromRoute] GetMaintenanceRequestDigitalAssetsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateMaintenanceRequestDigitalAssetRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMaintenanceRequestDigitalAssetResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMaintenanceRequestDigitalAssetResponse>> Update([FromBody] UpdateMaintenanceRequestDigitalAssetRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{maintenanceRequestDigitalAssetId}", Name = "RemoveMaintenanceRequestDigitalAssetRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveMaintenanceRequestDigitalAssetResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveMaintenanceRequestDigitalAssetResponse>> Remove([FromRoute] RemoveMaintenanceRequestDigitalAssetRequest request)
        => await _mediator.Send(request);
}

