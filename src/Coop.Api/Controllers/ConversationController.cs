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
public class ConversationController
{
    private readonly IMediator _mediator;
    public ConversationController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{conversationId}", Name = "GetConversationByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetConversationByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetConversationByIdResponse>> GetById([FromRoute] GetConversationByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Conversation == null)
        {
            return new NotFoundObjectResult(request.ConversationId);
        }
        return response;
    }
    [HttpGet(Name = "GetConversationsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetConversationsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetConversationsResponse>> Get()
        => await _mediator.Send(new GetConversationsRequest());
    [HttpPost(Name = "CreateConversationRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateConversationResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateConversationResponse>> Create([FromBody] CreateConversationRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetConversationsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetConversationsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetConversationsPageResponse>> Page([FromRoute] GetConversationsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateConversationRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateConversationResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateConversationResponse>> Update([FromBody] UpdateConversationRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{conversationId}", Name = "RemoveConversationRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveConversationResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveConversationResponse>> Remove([FromRoute] RemoveConversationRequest request)
        => await _mediator.Send(request);
}

