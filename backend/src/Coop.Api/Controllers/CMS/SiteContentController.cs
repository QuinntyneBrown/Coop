using Coop.Application.CMS.SiteContent.Commands.DiscardSiteContentDraft;
using Coop.Application.CMS.SiteContent.Commands.IssuePreviewToken;
using Coop.Application.CMS.SiteContent.Commands.PublishSiteContent;
using Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;
using Coop.Application.CMS.SiteContent.Queries.GetSiteContent;
using Coop.Application.CMS.SiteContent.Queries.GetSiteContentDraft;
using Coop.Application.CMS.SiteContent.Queries.GetSiteContentPreview;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.CMS;

/// <summary>
/// The header, footer and home page content of the public site (L2-REQ-094 to
/// L2-REQ-100), with its draft, publishing and preview tokens (L2-REQ-121,
/// L2-REQ-125). The published read and the preview read are anonymous; the
/// draft read and the token are the office's (the pipeline refuses a member);
/// saving, publishing and discarding are authorized per request by the
/// JsonContent aggregate privilege.
/// </summary>
[ApiController]
[Route("api/site-content")]
[Authorize]
public class SiteContentController : ControllerBase
{
    private readonly IMediator _mediator;

    public SiteContentController(IMediator mediator) => _mediator = mediator;

    /// <summary>
    /// The published copy; with <c>draft=true</c> the office's draft (401 when
    /// not signed in); with <c>preview</c> the draft for a valid token.
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get([FromQuery] bool draft = false, [FromQuery] string? preview = null)
    {
        if (draft)
        {
            if (User.Identity?.IsAuthenticated != true)
                return Unauthorized();
            return Ok(await _mediator.Send(new GetSiteContentDraftRequest()));
        }

        if (preview is not null)
            return Ok(await _mediator.Send(new GetSiteContentPreviewRequest { Token = preview }));

        var response = await _mediator.Send(new GetSiteContentRequest());
        return response.SiteContent is null ? NotFound() : Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult<SaveSiteContentResponse>> Save([FromBody] SaveSiteContentRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPost("publish")]
    public async Task<ActionResult<PublishSiteContentResponse>> Publish()
        => Ok(await _mediator.Send(new PublishSiteContentRequest()));

    [HttpDelete("draft")]
    public async Task<ActionResult<DiscardSiteContentDraftResponse>> Discard()
        => Ok(await _mediator.Send(new DiscardSiteContentDraftRequest()));

    [HttpPost("preview-token")]
    public async Task<ActionResult<IssuePreviewTokenResponse>> PreviewToken()
        => Ok(await _mediator.Send(new IssuePreviewTokenRequest()));
}
