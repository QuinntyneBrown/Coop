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
public class DocumentController
{
    private readonly IMediator _mediator;
    public DocumentController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{documentId}", Name = "GetDocumentByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDocumentById.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDocumentById.Response>> GetById([FromRoute] GetDocumentById.Request request)
    {
        var response = await _mediator.Send(request);
        if (response.Document == null)
        {
            return new NotFoundObjectResult(request.DocumentId);
        }
        return response;
    }
    [HttpGet(Name = "GetDocumentsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDocuments.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDocuments.Response>> Get()
        => await _mediator.Send(new GetDocuments.Request());
    [HttpPost(Name = "CreateDocumentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateDocument.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateDocument.Response>> Create([FromBody] CreateDocument.Request request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetDocumentsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDocumentsPage.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDocumentsPage.Response>> Page([FromRoute] GetDocumentsPage.Request request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateDocumentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateDocument.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateDocument.Response>> Update([FromBody] UpdateDocument.Request request)
        => await _mediator.Send(request);
    [HttpDelete("{documentId}", Name = "RemoveDocumentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveDocument.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveDocument.Response>> Remove([FromRoute] RemoveDocument.Request request)
        => await _mediator.Send(request);
}

