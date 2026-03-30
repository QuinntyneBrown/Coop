using Coop.Application.Documents.Commands.CreateDocument;
using Coop.Application.Documents.Commands.PublishDocument;
using Coop.Application.Documents.Commands.RemoveDocument;
using Coop.Application.Documents.Commands.UpdateDocument;
using Coop.Application.Documents.Queries.GetDocumentById;
using Coop.Application.Documents.Queries.GetDocuments;
using Coop.Application.Documents.Queries.GetDocumentsPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Document;

[ApiController]
[Route("api/document")]
[Authorize]
public class DocumentController : ControllerBase
{
    private readonly IMediator _mediator;

    public DocumentController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{documentId}")]
    public async Task<ActionResult<GetDocumentByIdResponse>> GetById([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new GetDocumentByIdRequest { DocumentId = documentId }));

    [HttpGet]
    public async Task<ActionResult<GetDocumentsResponse>> Get()
        => Ok(await _mediator.Send(new GetDocumentsRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateDocumentResponse>> Create([FromBody] CreateDocumentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateDocumentResponse>> Update([FromBody] UpdateDocumentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut("publish")]
    public async Task<ActionResult<PublishDocumentResponse>> Publish([FromBody] PublishDocumentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{documentId}")]
    public async Task<ActionResult<RemoveDocumentResponse>> Remove([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new RemoveDocumentRequest { DocumentId = documentId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetDocumentsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetDocumentsPageRequest { PageSize = pageSize, Index = index }));
}
