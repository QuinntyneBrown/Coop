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
public class RoleController
{
    private readonly IMediator _mediator;
    public RoleController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{roleId}", Name = "GetRoleByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetRoleByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetRoleByIdResponse>> GetById([FromRoute] GetRoleByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Role == null)
        {
            return new NotFoundObjectResult(request.RoleId);
        }
        return response;
    }
    [HttpGet(Name = "GetRolesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetRolesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetRolesResponse>> Get()
        => await _mediator.Send(new GetRolesRequest());
    [HttpPost(Name = "CreateRoleRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateRoleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateRoleResponse>> Create([FromBody] CreateRoleRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetRolesPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetRolesPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetRolesPageResponse>> Page([FromRoute] GetRolesPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateRoleRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateRoleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateRoleResponse>> Update([FromBody] UpdateRoleRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{roleId}", Name = "RemoveRoleRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveRoleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveRoleResponse>> Remove([FromRoute] RemoveRoleRequest request)
        => await _mediator.Send(request);
}

