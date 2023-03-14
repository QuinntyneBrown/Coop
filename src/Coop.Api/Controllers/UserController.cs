// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Coop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController
{
    private readonly IMediator _mediator;
    private readonly ILogger<UserController> _logger;
    public UserController(IMediator mediator, ILogger<UserController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    [HttpGet("{userId}", Name = "GetUserByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetUserById.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetUserById.Response>> GetById([FromRoute] GetUserById.Request request)
    {
        var response = await _mediator.Send(request);
        if (response.User == null)
        {
            return new NotFoundObjectResult(request.UserId);
        }
        return response;
    }
    [HttpGet(Name = "GetUsersRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetUsers.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetUsers.Response>> Get()
        => await _mediator.Send(new GetUsers.Request());
    [AllowAnonymous]
    [HttpGet("exists/{username}", Name = "UsernameExistsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CurrentUser.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UsernameExists.Response>> UsernameExists([FromRoute] UsernameExists.Request request)
        => await _mediator.Send(request);
    [AllowAnonymous]
    [HttpGet("current", Name = "GetCurrentUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CurrentUser.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CurrentUser.Response>> GetCurrent()
    {
        return await _mediator.Send(new CurrentUser.Request());
    }
    [HttpPost(Name = "CreateUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateUser.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateUser.Response>> Create([FromBody] CreateUser.Request request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetUsersPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetUsersPage.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetUsersPage.Response>> Page([FromRoute] GetUsersPage.Request request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateUser.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateUser.Response>> Update([FromBody] UpdateUser.Request request)
        => await _mediator.Send(request);
    [HttpDelete("{userId}", Name = "RemoveUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveUser.Response), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveUser.Response>> Remove([FromRoute] RemoveUser.Request request)
        => await _mediator.Send(request);
    [AllowAnonymous]
    [HttpPost("token", Name = "AuthenticateRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(Authenticate.Response), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<Authenticate.Response>> Authenticate([FromBody] Authenticate.Request request)
        => await _mediator.Send(request);
}

