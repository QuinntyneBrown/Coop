using Coop.Application.Profiles.Commands.CreateMember;
using Coop.Application.Profiles.Commands.UpdateMember;
using Coop.Application.Profiles.Queries.GetMemberById;
using Coop.Application.Profiles.Queries.GetMembers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Profile;

[ApiController]
[Route("api/members")]
[Authorize]
public class MembersController : ControllerBase
{
    private readonly IMediator _mediator;

    public MembersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<GetMembersResponse>> Get()
        => Ok(await _mediator.Send(new GetMembersRequest()));

    [HttpGet("{profileId}")]
    public async Task<ActionResult<GetMemberByIdResponse>> GetById([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetMemberByIdRequest { ProfileId = profileId }));

    [HttpPost]
    public async Task<ActionResult<CreateMemberResponse>> Create([FromBody] CreateMemberRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateMemberResponse>> Update([FromBody] UpdateMemberRequest request)
        => Ok(await _mediator.Send(request));
}
