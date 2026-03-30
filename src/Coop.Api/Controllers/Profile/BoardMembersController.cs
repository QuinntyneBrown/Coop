using Coop.Application.Profiles.Commands.CreateBoardMember;
using Coop.Application.Profiles.Commands.UpdateBoardMember;
using Coop.Application.Profiles.Queries.GetBoardMemberById;
using Coop.Application.Profiles.Queries.GetBoardMembers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Profile;

[ApiController]
[Route("api/boardmembers")]
[Authorize]
public class BoardMembersController : ControllerBase
{
    private readonly IMediator _mediator;

    public BoardMembersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<GetBoardMembersResponse>> Get()
        => Ok(await _mediator.Send(new GetBoardMembersRequest()));

    [HttpGet("{profileId}")]
    public async Task<ActionResult<GetBoardMemberByIdResponse>> GetById([FromRoute] Guid profileId)
        => Ok(await _mediator.Send(new GetBoardMemberByIdRequest { ProfileId = profileId }));

    [HttpPost]
    public async Task<ActionResult<CreateBoardMemberResponse>> Create([FromBody] CreateBoardMemberRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateBoardMemberResponse>> Update([FromBody] UpdateBoardMemberRequest request)
        => Ok(await _mediator.Send(request));
}
