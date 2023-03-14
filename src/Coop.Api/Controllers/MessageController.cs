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
public class MessageController
{
    private readonly IMediator _mediator;
    public MessageController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{messageId}", Name = "GetMessageByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMessageByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMessageByIdResponse>> GetById([FromRoute] GetMessageByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Message == null)
        {
            return new NotFoundObjectResult(request.MessageId);
        }
        return response;
    }
    [HttpGet(Name = "GetMessagesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMessagesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMessagesResponse>> Get()
        => await _mediator.Send(new GetMessagesRequest());
    [HttpGet("my", Name = "GetMyMessagesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetCurrentProfileMessagesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetCurrentProfileMessagesResponse>> GetMy()
        => await _mediator.Send(new GetCurrentProfileMessagesRequest());
    [HttpPost(Name = "CreateMessageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateMessageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateMessageResponse>> Create([FromBody] CreateMessageRequest request)
        => await _mediator.Send(request);
    [HttpPost("support", Name = "CreateSupportMessageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateSupportMessageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateSupportMessageResponse>> CreateSupport([FromBody] CreateSupportMessageRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetMessagesPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetMessagesPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetMessagesPageResponse>> Page([FromRoute] GetMessagesPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateMessageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateMessageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateMessageResponse>> Update([FromBody] UpdateMessageRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{messageId}", Name = "RemoveMessageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveMessageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveMessageResponse>> Remove([FromRoute] RemoveMessageRequest request)
        => await _mediator.Send(request);
}

