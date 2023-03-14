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
    [ProducesResponseType(typeof(GetReportById.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetReportById.Response>> GetById([FromRoute] GetReportById.Request request)
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
    [ProducesResponseType(typeof(GetReports.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetReports.Response>> Get()
        => await _mediator.Send(new GetReports.Request());
    [HttpGet("published", Name = "GetPublishedReportsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetPublishedReports.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetPublishedReports.Response>> GetPublished()
        => await _mediator.Send(new GetPublishedReports.Request());
    [HttpPost(Name = "CreateReportRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateReport.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateReport.Response>> Create([FromBody] CreateReport.Request request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetReportsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetReportsPage.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetReportsPage.Response>> Page([FromRoute] GetReportsPage.Request request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateReportRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateReport.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateReport.Response>> Update([FromBody] UpdateReport.Request request)
        => await _mediator.Send(request);
    [HttpDelete("{reportId}", Name = "RemoveReportRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveReport.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveReport.Response>> Remove([FromRoute] RemoveReport.Request request)
        => await _mediator.Send(request);
}

