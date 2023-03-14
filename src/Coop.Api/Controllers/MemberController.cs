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
public class MemberController
{
    private readonly IMediator _mediator;
    public MemberController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{memberId}", Name = "GetMemberByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMemberByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMemberByIdResponse>> GetById([FromRoute] GetMemberByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Member == null)
        {
            return new NotFoundObjectResult(request.MemberId);
        }
        return response;
    }
    [HttpGet(Name = "GetMembersRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMembersResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMembersResponse>> Get()
        => await _mediator.Send(new GetMembersRequest());
    [HttpGet("page/{pageSize}/{index}", Name = "GetMembersPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMembersPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMembersPageResponse>> Page([FromRoute] GetMembersPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateMemberRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMemberResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMemberResponse>> Update([FromBody] UpdateMemberRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{memberId}", Name = "RemoveMemberRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveMemberResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveMemberResponse>> Remove([FromRoute] RemoveMemberRequest request)
        => await _mediator.Send(request);
}

