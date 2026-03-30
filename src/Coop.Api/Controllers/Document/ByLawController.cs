using Coop.Application.Documents.Commands.CreateByLaw;
using Coop.Application.Documents.Commands.RemoveByLaw;
using Coop.Application.Documents.Commands.UpdateByLaw;
using Coop.Application.Documents.Queries.GetByLawById;
using Coop.Application.Documents.Queries.GetByLaws;
using Coop.Application.Documents.Queries.GetByLawsPage;
using Coop.Application.Documents.Queries.GetPublishedByLaws;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Document;

[ApiController]
[Route("api/bylaw")]
[Authorize]
public class ByLawController : ControllerBase
{
    private readonly IMediator _mediator;

    public ByLawController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{documentId}")]
    public async Task<ActionResult<GetByLawByIdResponse>> GetById([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new GetByLawByIdRequest { DocumentId = documentId }));

    [HttpGet]
    public async Task<ActionResult<GetByLawsResponse>> Get()
        => Ok(await _mediator.Send(new GetByLawsRequest()));

    [HttpGet("published")]
    [AllowAnonymous]
    public async Task<ActionResult<GetPublishedByLawsResponse>> GetPublished()
        => Ok(await _mediator.Send(new GetPublishedByLawsRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateByLawResponse>> Create([FromBody] CreateByLawRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateByLawResponse>> Update([FromBody] UpdateByLawRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{documentId}")]
    public async Task<ActionResult<RemoveByLawResponse>> Remove([FromRoute] Guid documentId)
        => Ok(await _mediator.Send(new RemoveByLawRequest { DocumentId = documentId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetByLawsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetByLawsPageRequest { PageSize = pageSize, Index = index }));
}
