using Coop.Application.Privileges.Commands.CreatePrivilege;
using Coop.Application.Privileges.Commands.RemovePrivilege;
using Coop.Application.Privileges.Commands.UpdatePrivilege;
using Coop.Application.Privileges.Queries.GetPrivilegeById;
using Coop.Application.Privileges.Queries.GetPrivileges;
using Coop.Application.Privileges.Queries.GetPrivilegesPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Identity;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PrivilegeController : ControllerBase
{
    private readonly IMediator _mediator;

    public PrivilegeController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{privilegeId}")]
    public async Task<ActionResult<GetPrivilegeByIdResponse>> GetById([FromRoute] Guid privilegeId)
        => Ok(await _mediator.Send(new GetPrivilegeByIdRequest { PrivilegeId = privilegeId }));

    [HttpGet]
    public async Task<ActionResult<GetPrivilegesResponse>> Get()
        => Ok(await _mediator.Send(new GetPrivilegesRequest()));

    [HttpPost]
    public async Task<ActionResult<CreatePrivilegeResponse>> Create([FromBody] CreatePrivilegeRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdatePrivilegeResponse>> Update([FromBody] UpdatePrivilegeRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{privilegeId}")]
    public async Task<ActionResult<RemovePrivilegeResponse>> Remove([FromRoute] Guid privilegeId)
        => Ok(await _mediator.Send(new RemovePrivilegeRequest { PrivilegeId = privilegeId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetPrivilegesPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetPrivilegesPageRequest { PageSize = pageSize, Index = index }));
}
