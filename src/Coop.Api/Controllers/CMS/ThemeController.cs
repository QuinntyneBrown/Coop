using Coop.Application.CMS.Themes.Commands.CreateTheme;
using Coop.Application.CMS.Themes.Commands.RemoveTheme;
using Coop.Application.CMS.Themes.Commands.UpdateTheme;
using Coop.Application.CMS.Themes.Queries.GetDefaultTheme;
using Coop.Application.CMS.Themes.Queries.GetThemeById;
using Coop.Application.CMS.Themes.Queries.GetThemeByProfile;
using Coop.Application.CMS.Themes.Queries.GetThemes;
using Coop.Application.CMS.Themes.Queries.GetThemesPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.CMS;

[ApiController]
[Route("api/theme")]
[Authorize]
public class ThemeController : ControllerBase
{
    private readonly IMediator _mediator;

    public ThemeController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{themeId}")]
    public async Task<ActionResult<GetThemeByIdResponse>> GetById([FromRoute] Guid themeId)
        => Ok(await _mediator.Send(new GetThemeByIdRequest { ThemeId = themeId }));

    [HttpGet]
    public async Task<ActionResult<GetThemesResponse>> Get()
        => Ok(await _mediator.Send(new GetThemesRequest()));

    [HttpGet("default")]
    public async Task<ActionResult<GetDefaultThemeResponse>> GetDefault()
        => Ok(await _mediator.Send(new GetDefaultThemeRequest()));

    [HttpGet("profile/{profileId}")]
    public async Task<ActionResult<GetThemeByProfileResponse>> GetByProfile([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetThemeByProfileRequest { ProfileId = profileId }));

    [HttpPost]
    public async Task<ActionResult<CreateThemeResponse>> Create([FromBody] CreateThemeRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateThemeResponse>> Update([FromBody] UpdateThemeRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{themeId}")]
    public async Task<ActionResult<RemoveThemeResponse>> Remove([FromRoute] Guid themeId)
        => Ok(await _mediator.Send(new RemoveThemeRequest { ThemeId = themeId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetThemesPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetThemesPageRequest { PageSize = pageSize, Index = index }));
}
