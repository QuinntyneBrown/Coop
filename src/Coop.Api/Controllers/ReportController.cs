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
public class ReportController
{
    private readonly IMediator _mediator;
    public ReportController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{reportId}", Name = "GetReportByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetReportByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetReportByIdResponse>> GetById([FromRoute] GetReportByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Report == null)
        {
            return new NotFoundObjectResult(request.ReportId);
        }
        return response;
    }
    [HttpGet(Name = "GetReportsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetReportsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetReportsResponse>> Get()
        => await _mediator.Send(new GetReportsRequest());
    [HttpGet("published", Name = "GetPublishedReportsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetPublishedReportsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetPublishedReportsResponse>> GetPublished()
        => await _mediator.Send(new GetPublishedReportsRequest());
    [HttpPost(Name = "CreateReportRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateReportResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateReportResponse>> Create([FromBody] CreateReportRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetReportsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetReportsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetReportsPageResponse>> Page([FromRoute] GetReportsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateReportRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateReportResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateReportResponse>> Update([FromBody] UpdateReportRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{reportId}", Name = "RemoveReportRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveReportResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveReportResponse>> Remove([FromRoute] RemoveReportRequest request)
        => await _mediator.Send(request);
}

