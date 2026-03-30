using Coop.Application.Identity.Commands.Authenticate;
using Coop.Application.Identity.Commands.ChangePassword;
using Coop.Application.Identity.Commands.CreateUser;
using Coop.Application.Identity.Commands.RemoveUser;
using Coop.Application.Identity.Commands.SetPassword;
using Coop.Application.Identity.Commands.UpdateUser;
using Coop.Application.Identity.Queries.GetCurrentUser;
using Coop.Application.Identity.Queries.GetUserById;
using Coop.Application.Identity.Queries.GetUsers;
using Coop.Application.Identity.Queries.GetUsersPage;
using Coop.Application.Identity.Queries.UsernameExists;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Identity;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{userId}")]
    [Authorize]
    public async Task<ActionResult<GetUserByIdResponse>> GetById([FromRoute] Guid userId)
    {
        var response = await _mediator.Send(new GetUserByIdRequest { UserId = userId });
        return Ok(response);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<GetUsersResponse>> Get()
    {
        var response = await _mediator.Send(new GetUsersRequest());
        return Ok(response);
    }

    [HttpGet("exists/{username}")]
    [AllowAnonymous]
    public async Task<ActionResult<UsernameExistsResponse>> UsernameExists([FromRoute] string username)
    {
        var response = await _mediator.Send(new UsernameExistsRequest { Username = username });
        return Ok(response);
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<GetCurrentUserResponse>> GetCurrentUser()
    {
        var response = await _mediator.Send(new GetCurrentUserRequest());
        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateUserResponse>> Create([FromBody] CreateUserRequest request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }

    [HttpPost("token")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthenticateResponse>> Authenticate([FromBody] AuthenticateRequest request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<UpdateUserResponse>> Update([FromBody] UpdateUserRequest request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }

    [HttpPut("password")]
    [Authorize]
    public async Task<ActionResult<ChangePasswordResponse>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }

    [HttpPut("password/reset")]
    [Authorize]
    public async Task<ActionResult<SetPasswordResponse>> SetPassword([FromBody] SetPasswordRequest request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }

    [HttpDelete("{userId}")]
    [Authorize]
    public async Task<ActionResult<RemoveUserResponse>> Remove([FromRoute] Guid userId)
    {
        var response = await _mediator.Send(new RemoveUserRequest { UserId = userId });
        return Ok(response);
    }

    [HttpGet("page/{pageSize}/{index}")]
    [Authorize]
    public async Task<ActionResult<GetUsersPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
    {
        var response = await _mediator.Send(new GetUsersPageRequest { PageSize = pageSize, Index = index });
        return Ok(response);
    }
}
