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
public class PrivilegeController
{
    private readonly IMediator _mediator;
    public PrivilegeController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{privilegeId}", Name = "GetPrivilegeByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetPrivilegeByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetPrivilegeByIdResponse>> GetById([FromRoute] GetPrivilegeByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Privilege == null)
        {
            return new NotFoundObjectResult(request.PrivilegeId);
        }
        return response;
    }
    [HttpGet(Name = "GetPrivilegesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetPrivilegesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetPrivilegesResponse>> Get()
        => await _mediator.Send(new GetPrivilegesRequest());
    [HttpPost(Name = "CreatePrivilegeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreatePrivilegeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreatePrivilegeResponse>> Create([FromBody] CreatePrivilegeRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetPrivilegesPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetPrivilegesPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetPrivilegesPageResponse>> Page([FromRoute] GetPrivilegesPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdatePrivilegeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdatePrivilegeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdatePrivilegeResponse>> Update([FromBody] UpdatePrivilegeRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{privilegeId}", Name = "RemovePrivilegeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemovePrivilegeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemovePrivilegeResponse>> Remove([FromRoute] RemovePrivilegeRequest request)
        => await _mediator.Send(request);
}

