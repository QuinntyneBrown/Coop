using Coop.Application.Documents.Commands.CreateReport;
using Coop.Application.Documents.Commands.RemoveReport;
using Coop.Application.Documents.Commands.UpdateReport;
using Coop.Application.Documents.Queries.GetReportById;
using Coop.Application.Documents.Queries.GetReports;
using Coop.Application.Documents.Queries.GetReportsPage;
using Coop.Application.Documents.Queries.GetPublishedReports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Document;

[ApiController]
[Route("api/report")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{documentId}")]
    public async Task<ActionResult<GetReportByIdResponse>> GetById([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new GetReportByIdRequest { DocumentId = documentId }));

    [HttpGet]
    public async Task<ActionResult<GetReportsResponse>> Get()
        => Ok(await _mediator.Send(new GetReportsRequest()));

    [HttpGet("published")]
    [AllowAnonymous]
    public async Task<ActionResult<GetPublishedReportsResponse>> GetPublished()
        => Ok(await _mediator.Send(new GetPublishedReportsRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateReportResponse>> Create([FromBody] CreateReportRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateReportResponse>> Update([FromBody] UpdateReportRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{documentId}")]
    public async Task<ActionResult<RemoveReportResponse>> Remove([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new RemoveReportRequest { DocumentId = documentId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetReportsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetReportsPageRequest { PageSize = pageSize, Index = index }));
}
