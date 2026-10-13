using Coop.Application.Profiles.Commands.CreateStaffMember;
using Coop.Application.Profiles.Commands.UpdateStaffMember;
using Coop.Application.Profiles.Queries.GetStaffMemberById;
using Coop.Application.Profiles.Queries.GetStaffMembers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Profile;

[ApiController]
[Route("api/staffmembers")]
[Authorize]
public class StaffMembersController : ControllerBase
{
    private readonly IMediator _mediator;

    public StaffMembersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<GetStaffMembersResponse>> Get()
        => Ok(await _mediator.Send(new GetStaffMembersRequest()));

    [HttpGet("{profileId}")]
    public async Task<ActionResult<GetStaffMemberByIdResponse>> GetById([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetStaffMemberByIdRequest { ProfileId = profileId }));

    [HttpPost]
    public async Task<ActionResult<CreateStaffMemberResponse>> Create([FromBody] CreateStaffMemberRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateStaffMemberResponse>> Update([FromBody] UpdateStaffMemberRequest request)
        => Ok(await _mediator.Send(request));
}
