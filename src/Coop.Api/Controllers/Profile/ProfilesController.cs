using Coop.Application.Profiles.Commands.DeleteProfile;
using Coop.Application.Profiles.Commands.SetProfileAvatar;
using Coop.Application.Profiles.Queries.GetProfileById;
using Coop.Application.Profiles.Queries.GetProfiles;
using Coop.Application.Profiles.Queries.GetProfilesByUserId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Profile;

[ApiController]
[Route("api/profiles")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfilesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<GetProfilesResponse>> Get()
        => Ok(await _mediator.Send(new GetProfilesRequest()));

    [HttpGet("{profileId}")]
    public async Task<ActionResult<GetProfileByIdResponse>> GetById([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetProfileByIdRequest { ProfileId = profileId }));

    [HttpGet("by-user/{userId}")]
    public async Task<ActionResult<GetProfilesByUserIdResponse>> GetByUserId([FromRoute] Guid userId)
        => Ok(await _mediator.Send(new GetProfilesByUserIdRequest { UserId = userId }));

    [HttpPut("avatar")]
    public async Task<ActionResult<SetProfileAvatarResponse>> SetAvatar([FromBody] SetProfileAvatarRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{profileId}")]
    public async Task<ActionResult<DeleteProfileResponse>> Delete([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new DeleteProfileRequest { ProfileId = profileId }));
}
