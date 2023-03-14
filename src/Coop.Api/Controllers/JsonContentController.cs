// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.JsonContents;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Coop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JsonContentController
{
    private readonly IMediator _mediator;
    public JsonContentController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{jsonContentId}", Name = "GetJsonContentByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetJsonContentByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetJsonContentByIdResponse>> GetById([FromRoute] GetJsonContentByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.JsonContent == null)
        {
            return new NotFoundObjectResult(request.JsonContentId);
        }
        return response;
    }
    [HttpGet("name/{name}", Name = "GetJsonContentByNameRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetJsonContentByNameResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetJsonContentByNameResponse>> GetByName([FromRoute] GetJsonContentByNameRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.JsonContent == null)
        {
            return new NotFoundObjectResult(request.Name);
        }
        return response;
    }
    [HttpGet(Name = "GetJsonContentsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetJsonContentsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetJsonContentsResponse>> Get()
        => await _mediator.Send(new GetJsonContentsRequest());
    [HttpPost(Name = "CreateJsonContentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateJsonContentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateJsonContentResponse>> Create([FromBody] CreateJsonContentRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetJsonContentsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetJsonContentsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetJsonContentsPageResponse>> Page([FromRoute] GetJsonContentsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateJsonContentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateJsonContentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateJsonContentResponse>> Update([FromBody] UpdateJsonContentRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{jsonContentId}", Name = "RemoveJsonContentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveJsonContentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveJsonContentResponse>> Remove([FromRoute] RemoveJsonContentRequest request)
        => await _mediator.Send(request);
}

