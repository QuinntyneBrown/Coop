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
public class ThemeController
{
    private readonly IMediator _mediator;
    public ThemeController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{themeId}", Name = "GetThemeByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetThemeByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetThemeByIdResponse>> GetById([FromRoute] GetThemeByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Theme == null)
        {
            return new NotFoundObjectResult(request.ThemeId);
        }
        return response;
    }
    [HttpGet("default", Name = "GetDefaultThemeRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetDefaultThemeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetDefaultThemeResponse>> GetDefault([FromRoute] GetDefaultThemeRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Theme == null)
        {
            return new NotFoundObjectResult(null);
        }
        return response;
    }
    [HttpGet("profile/{profileId}", Name = "GetThemeByProfileIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetThemeByProfileIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetThemeByProfileIdResponse>> GetByProfileId([FromRoute] GetThemeByProfileIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Theme == null)
        {
            return new NotFoundObjectResult(request.ProfileId);
        }
        return response;
    }
    [HttpGet(Name = "GetThemesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetThemesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetThemesResponse>> Get()
        => await _mediator.Send(new GetThemesRequest());
    [HttpPost(Name = "CreateThemeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateThemeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateThemeResponse>> Create([FromBody] CreateThemeRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetThemesPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetThemesPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetThemesPageResponse>> Page([FromRoute] GetThemesPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateThemeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateThemeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateThemeResponse>> Update([FromBody] UpdateThemeRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{themeId}", Name = "RemoveThemeRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveThemeResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveThemeResponse>> Remove([FromRoute] RemoveThemeRequest request)
        => await _mediator.Send(request);
}

