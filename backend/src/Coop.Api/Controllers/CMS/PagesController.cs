using Coop.Application.CMS.Pages.Commands.CreatePage;
using Coop.Application.CMS.Pages.Commands.RemovePage;
using Coop.Application.CMS.Pages.Commands.UpdatePage;
using Coop.Application.CMS.Pages.Queries.GetPageBySlug;
using Coop.Application.CMS.Pages.Queries.GetPages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.CMS;

/// <summary>
/// Website pages the office manages (L2-REQ-080, L2-REQ-081). Reads are
/// anonymous; changes are authorized per request by the Page aggregate privilege.
/// </summary>
[ApiController]
[Route("api/pages")]
[Authorize]
public class PagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PagesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<GetPagesResponse>> Get()
        => Ok(await _mediator.Send(new GetPagesRequest()));

    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<GetPageBySlugResponse>> GetBySlug([FromRoute] string slug)
    {
        var response = await _mediator.Send(new GetPageBySlugRequest { Slug = slug });
        return response.Page is null ? NotFound(new { message = "Page not found." }) : Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<CreatePageResponse>> Create([FromBody] CreatePageRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdatePageResponse>> Update([FromBody] UpdatePageRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{pageId}")]
    public async Task<ActionResult<RemovePageResponse>> Remove([FromRoute] Guid pageId)
        => Ok(await _mediator.Send(new RemovePageRequest { PageId = pageId }));
}
