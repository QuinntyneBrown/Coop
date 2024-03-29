// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Coop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConnectorController
{
    private readonly IMediator _mediator;
    public ConnectorController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost, DisableRequestSizeLimit]
    public async Task<ActionResult<ConnectorUploadDigitalAssetResponse>> Post()
        => await _mediator.Send(new ConnectorUploadDigitalAssetRequest());
}

