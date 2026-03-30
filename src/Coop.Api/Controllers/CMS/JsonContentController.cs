using Coop.Application.CMS.Content.Commands.CreateJsonContent;
using Coop.Application.CMS.Content.Commands.RemoveJsonContent;
using Coop.Application.CMS.Content.Commands.UpdateJsonContent;
using Coop.Application.CMS.Content.Queries.GetJsonContentById;
using Coop.Application.CMS.Content.Queries.GetJsonContentByName;
using Coop.Application.CMS.Content.Queries.GetJsonContents;
using Coop.Application.CMS.Content.Queries.GetJsonContentsPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.CMS;

[ApiController]
[Route("api/jsoncontent")]
[Authorize]
public class JsonContentController : ControllerBase
{
    private readonly IMediator _mediator;

    public JsonContentController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{jsonContentId}")]
    public async Task<ActionResult<GetJsonContentByIdResponse>> GetById([FromRoute] Guid jsonContentId)
        => Ok(await _mediator.Send(new GetJsonContentByIdRequest { JsonContentId = jsonContentId }));

    [HttpGet]
    public async Task<ActionResult<GetJsonContentsResponse>> Get()
        => Ok(await _mediator.Send(new GetJsonContentsRequest()));

    [HttpGet("name/{name}")]
    [AllowAnonymous]
    public async Task<ActionResult<GetJsonContentByNameResponse>> GetByName([FromRoute] string name)
        => Ok(await _mediator.Send(new GetJsonContentByNameRequest { Name = name }));

    [HttpPost]
    public async Task<ActionResult<CreateJsonContentResponse>> Create([FromBody] CreateJsonContentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateJsonContentResponse>> Update([FromBody] UpdateJsonContentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{jsonContentId}")]
    public async Task<ActionResult<RemoveJsonContentResponse>> Remove([FromRoute] Guid jsonContentId)
        => Ok(await _mediator.Send(new RemoveJsonContentRequest { JsonContentId = jsonContentId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetJsonContentsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetJsonContentsPageRequest { PageSize = pageSize, Index = index }));
}
