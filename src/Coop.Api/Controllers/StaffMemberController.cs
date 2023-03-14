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
public class StaffMemberController
{
    private readonly IMediator _mediator;
    public StaffMemberController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{staffMemberId}", Name = "GetStaffMemberByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetStaffMemberByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetStaffMemberByIdResponse>> GetById([FromRoute] GetStaffMemberByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.StaffMember == null)
        {
            return new NotFoundObjectResult(request.StaffMemberId);
        }
        return response;
    }
    [HttpGet(Name = "GetStaffMembersRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetStaffMembersResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetStaffMembersResponse>> Get()
        => await _mediator.Send(new GetStaffMembersRequest());
    [HttpGet("page/{pageSize}/{index}", Name = "GetStaffMembersPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetStaffMembersPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetStaffMembersPageResponse>> Page([FromRoute] GetStaffMembersPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateStaffMemberRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateStaffMemberResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateStaffMemberResponse>> Update([FromBody] UpdateStaffMemberRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{staffMemberId}", Name = "RemoveStaffMemberRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveStaffMemberResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveStaffMemberResponse>> Remove([FromRoute] RemoveStaffMemberRequest request)
        => await _mediator.Send(request);
}

