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
public class NoticeController
{
    private readonly IMediator _mediator;
    public NoticeController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{noticeId}", Name = "GetNoticeByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetNoticeByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetNoticeByIdResponse>> GetById([FromRoute] GetNoticeByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Notice == null)
        {
            return new NotFoundObjectResult(request.NoticeId);
        }
        return response;
    }
    [HttpGet(Name = "GetNoticesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetNoticesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetNoticesResponse>> Get()
        => await _mediator.Send(new GetNoticesRequest());
    [HttpGet("published", Name = "GetPublishedNoticesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetPublishedNoticesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetPublishedNoticesResponse>> GetPublished()
        => await _mediator.Send(new GetPublishedNoticesRequest());
    [HttpPost(Name = "CreateNoticeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateNoticeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateNoticeResponse>> Create([FromBody] CreateNoticeRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetNoticesPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetNoticesPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetNoticesPageResponse>> Page([FromRoute] GetNoticesPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateNoticeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateNoticeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateNoticeResponse>> Update([FromBody] UpdateNoticeRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{noticeId}", Name = "RemoveNoticeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveNoticeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveNoticeResponse>> Remove([FromRoute] RemoveNoticeRequest request)
        => await _mediator.Send(request);
}

