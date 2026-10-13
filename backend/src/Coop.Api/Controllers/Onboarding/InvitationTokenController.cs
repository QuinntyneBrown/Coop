using Coop.Application.Onboarding.Commands.CreateInvitationToken;
using Coop.Application.Onboarding.Commands.RemoveInvitationToken;
using Coop.Application.Onboarding.Commands.UpdateInvitationToken;
using Coop.Application.Onboarding.Commands.ValidateInvitationToken;
using Coop.Application.Onboarding.Queries.GetInvitationTokenById;
using Coop.Application.Onboarding.Queries.GetInvitationTokens;
using Coop.Application.Onboarding.Queries.GetInvitationTokensPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Onboarding;

[ApiController]
[Route("api/invitationtoken")]
[Authorize]
public class InvitationTokenController : ControllerBase
{
    private readonly IMediator _mediator;

    public InvitationTokenController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{invitationTokenId}")]
    public async Task<ActionResult<GetInvitationTokenByIdResponse>> GetById([FromRoute] Guid invitationTokenId)
        => Ok(await _mediator.Send(new GetInvitationTokenByIdRequest { InvitationTokenId = invitationTokenId }));

    [HttpGet]
    public async Task<ActionResult<GetInvitationTokensResponse>> Get()
        => Ok(await _mediator.Send(new GetInvitationTokensRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateInvitationTokenResponse>> Create([FromBody] CreateInvitationTokenRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateInvitationTokenResponse>> Update([FromBody] UpdateInvitationTokenRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{invitationTokenId}")]
    public async Task<ActionResult<RemoveInvitationTokenResponse>> Remove([FromRoute] Guid invitationTokenId)
        => Ok(await _mediator.Send(new RemoveInvitationTokenRequest { InvitationTokenId = invitationTokenId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetInvitationTokensPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetInvitationTokensPageRequest { PageSize = pageSize, Index = index }));

    [HttpGet("validate/{value}")]
    [AllowAnonymous]
    public async Task<ActionResult<ValidateInvitationTokenResponse>> Validate([FromRoute] string value)
        => Ok(await _mediator.Send(new ValidateInvitationTokenRequest { Value = value }));
}
