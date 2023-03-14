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
    [ProducesResponseType(typeof(GetDocumentByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDocumentByIdResponse>> GetById([FromRoute] GetDocumentByIdRequest request)
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
    [ProducesResponseType(typeof(GetDocumentsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDocumentsResponse>> Get()
        => await _mediator.Send(new GetDocumentsRequest());
    [HttpPost(Name = "CreateDocumentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateDocumentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateDocumentResponse>> Create([FromBody] CreateDocumentRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetDocumentsPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDocumentsPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDocumentsPageResponse>> Page([FromRoute] GetDocumentsPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateDocumentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateDocumentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateDocumentResponse>> Update([FromBody] UpdateDocumentRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{documentId}", Name = "RemoveDocumentRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveDocumentResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveDocumentResponse>> Remove([FromRoute] RemoveDocumentRequest request)
        => await _mediator.Send(request);
}

