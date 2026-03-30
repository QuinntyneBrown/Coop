using Coop.Application.Documents.Commands.CreateNotice;
using Coop.Application.Documents.Commands.RemoveNotice;
using Coop.Application.Documents.Commands.UpdateNotice;
using Coop.Application.Documents.Queries.GetNoticeById;
using Coop.Application.Documents.Queries.GetNotices;
using Coop.Application.Documents.Queries.GetNoticesPage;
using Coop.Application.Documents.Queries.GetPublishedNotices;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Document;

[ApiController]
[Route("api/notice")]
[Authorize]
public class NoticeController : ControllerBase
{
    private readonly IMediator _mediator;

    public NoticeController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{documentId}")]
    public async Task<ActionResult<GetNoticeByIdResponse>> GetById([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new GetNoticeByIdRequest { DocumentId = documentId }));

    [HttpGet]
    public async Task<ActionResult<GetNoticesResponse>> Get()
        => Ok(await _mediator.Send(new GetNoticesRequest()));

    [HttpGet("published")]
    [AllowAnonymous]
    public async Task<ActionResult<GetPublishedNoticesResponse>> GetPublished()
        => Ok(await _mediator.Send(new GetPublishedNoticesRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateNoticeResponse>> Create([FromBody] CreateNoticeRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateNoticeResponse>> Update([FromBody] UpdateNoticeRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{documentId}")]
    public async Task<ActionResult<RemoveNoticeResponse>> Remove([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new RemoveNoticeRequest { DocumentId = documentId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetNoticesPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetNoticesPageRequest { PageSize = pageSize, Index = index }));
}
