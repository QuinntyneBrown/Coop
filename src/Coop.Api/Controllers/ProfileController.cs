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
public class ProfileController
{
    private readonly IMediator _mediator;
    public ProfileController(IMediator mediator)
        => _mediator = mediator;
    [HttpGet("{profileId}", Name = "GetProfileByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetProfileByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetProfileByIdResponse>> GetById([FromRoute] GetProfileByIdRequest request)
    {
        var response = await _mediator.Send(request);
        if (response.Profile == null)
        {
            return new NotFoundObjectResult(request.ProfileId);
        }
        return response;
    }
    [HttpGet(Name = "GetProfilesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetProfilesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetProfilesResponse>> Get()
        => await _mediator.Send(new GetProfilesRequest());
    [HttpGet("current", Name = "GetCurrentProfileRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CurrentProfileResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CurrentProfileResponse>> GetCurrent()
        => await _mediator.Send(new CurrentProfileRequest());
    [HttpPost(Name = "CreateProfileRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateProfileResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateProfileResponse>> Create([FromBody] CreateProfileRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetProfilesPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetProfilesPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetProfilesPageResponse>> Page([FromRoute] GetProfilesPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateProfileRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateProfileResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateProfileResponse>> Update([FromBody] UpdateProfileRequest request)
        => await _mediator.Send(request);
    [HttpPut("avatar", Name = "UpdateProfileAvatarRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateProfileAvatarResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateProfileAvatarResponse>> UpdateAvatar([FromBody] UpdateProfileAvatarRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{profileId}", Name = "RemoveProfileRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveProfileResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveProfileResponse>> Remove([FromRoute] RemoveProfileRequest request)
        => await _mediator.Send(request);
}

