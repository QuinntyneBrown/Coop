using Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;
using Coop.Application.CMS.SiteContent.Queries.GetSiteContent;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.CMS;

/// <summary>
/// The header, footer and home page content of the public site (L2-REQ-094 to
/// L2-REQ-100). Reads are anonymous; saving is authorized per request by the
/// JsonContent aggregate privilege.
/// </summary>
[ApiController]
[Route("api/site-content")]
[Authorize]
public class SiteContentController : ControllerBase
{
    private readonly IMediator _mediator;

    public SiteContentController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<GetSiteContentResponse>> Get()
    {
        var response = await _mediator.Send(new GetSiteContentRequest());
        return response.SiteContent is null ? NotFound() : Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult<SaveSiteContentResponse>> Save([FromBody] SaveSiteContentRequest request)
        => Ok(await _mediator.Send(request));
}
