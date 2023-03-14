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
public class ByLawController
{
    private readonly IMediator _mediator;
    public ByLawController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{byLawId}", Name = "GetByLawByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetByLawByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetByLawByIdResponse>> GetById([FromRoute] GetByLawByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.ByLaw == null)
        {
            return new NotFoundObjectResult(request.ByLawId);
        }
        return response;
    }
    [HttpGet(Name = "GetByLawsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetByLawsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetByLawsResponse>> Get()
        => await _mediator.Send(new GetByLawsRequest());
    [HttpGet("published", Name = "GetPublishedByLawsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetPublishedByLawsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetPublishedByLawsResponse>> GetPublished()
        => await _mediator.Send(new GetPublishedByLawsRequest());
    [HttpPost(Name = "CreateByLawRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateByLawResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateByLawResponse>> Create([FromBody] CreateByLawRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetByLawsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetByLawsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetByLawsPageResponse>> Page([FromRoute] GetByLawsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateByLawRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateByLawResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateByLawResponse>> Update([FromBody] UpdateByLawRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{byLawId}", Name = "RemoveByLawRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveByLawResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveByLawResponse>> Remove([FromRoute] RemoveByLawRequest request)
        => await _mediator.Send(request);
}

