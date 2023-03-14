// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Coop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvitationTokenController
{
    private readonly IMediator _mediator;
    public InvitationTokenController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{invitationTokenId}", Name = "GetInvitationTokenByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetInvitationTokenByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetInvitationTokenByIdResponse>> GetById([FromRoute] GetInvitationTokenByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.InvitationToken == null)
        {
            return new NotFoundObjectResult(request.InvitationTokenId);
        }
        return response;
    }
    [HttpGet(Name = "GetInvitationTokensRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetInvitationTokensResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetInvitationTokensResponse>> Get()
        => await _mediator.Send(new GetInvitationTokensRequest());
    [HttpPost(Name = "CreateInvitationTokenRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateInvitationTokenResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateInvitationTokenResponse>> Create([FromBody] CreateInvitationTokenRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetInvitationTokensPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetInvitationTokensPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetInvitationTokensPageResponse>> Page([FromRoute] GetInvitationTokensPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateInvitationTokenRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateInvitationTokenExpiryResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateInvitationTokenExpiryResponse>> Update([FromBody] UpdateInvitationTokenExpiryRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{invitationTokenId}", Name = "RemoveInvitationTokenRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveInvitationTokenResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveInvitationTokenResponse>> Remove([FromRoute] RemoveInvitationTokenRequest request)
        => await _mediator.Send(request);
}

