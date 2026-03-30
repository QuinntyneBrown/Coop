using Coop.Application.Roles.Commands.CreateRole;
using Coop.Application.Roles.Commands.RemoveRole;
using Coop.Application.Roles.Commands.UpdateRole;
using Coop.Application.Roles.Queries.GetRoleById;
using Coop.Application.Roles.Queries.GetRoles;
using Coop.Application.Roles.Queries.GetRolesPage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Identity;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RoleController : ControllerBase
{
    private readonly IMediator _mediator;

    public RoleController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{roleId}")]
    public async Task<ActionResult<GetRoleByIdResponse>> GetById([FromRoute] Guid roleId)
        => Ok(await _mediator.Send(new GetRoleByIdRequest { RoleId = roleId }));

    [HttpGet]
    public async Task<ActionResult<GetRolesResponse>> Get()
        => Ok(await _mediator.Send(new GetRolesRequest()));

    [HttpPost]
    public async Task<ActionResult<CreateRoleResponse>> Create([FromBody] CreateRoleRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPut]
    public async Task<ActionResult<UpdateRoleResponse>> Update([FromBody] UpdateRoleRequest request)
        => Ok(await _mediator.Send(request));

    [HttpDelete("{roleId}")]
    public async Task<ActionResult<RemoveRoleResponse>> Remove([FromRoute] Guid roleId)
        => Ok(await _mediator.Send(new RemoveRoleRequest { RoleId = roleId }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetRolesPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetRolesPageRequest { PageSize = pageSize, Index = index }));
}
