// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.BoardMembers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Threading.Tasks;

namespace Coop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardMemberController
{
    private readonly IMediator _mediator;
    private readonly ILogger<BoardMemberController> _logger;
    public BoardMemberController(IMediator mediator, ILogger<BoardMemberController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }
    [HttpGet("{boardMemberId}", Name = "GetBoardMemberByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardMemberByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardMemberByIdResponse>> GetById([FromRoute] GetBoardMemberByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.BoardMember == null)
        {
            return new NotFoundObjectResult(request.BoardMemberId);
        }
        return response;
    }
    [HttpGet(Name = "GetBoardMembersRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardMembersResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardMembersResponse>> Get()
        => await _mediator.Send(new GetBoardMembersRequest());
    [HttpGet("page/{pageSize}/{index}", Name = "GetBoardMembersPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetBoardMembersPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetBoardMembersPageResponse>> Page([FromRoute] GetBoardMembersPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateBoardMemberRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateBoardMemberResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateBoardMemberResponse>> Update([FromBody] UpdateBoardMemberRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{boardMemberId}", Name = "RemoveBoardMemberRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveBoardMemberResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveBoardMemberResponse>> Remove([FromRoute] RemoveBoardMemberRequest request)
        => await _mediator.Send(request);
}

