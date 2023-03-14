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
    [ProducesResponseType(typeof(GetUserByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetUserByIdResponse>> GetById([FromRoute] GetUserByIdRequest request)
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
    [ProducesResponseType(typeof(GetUsersResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetUsersResponse>> Get()
        => await _mediator.Send(new GetUsersRequest());
    [AllowAnonymous]
    [HttpGet("exists/{username}", Name = "UsernameExistsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CurrentUserResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UsernameExistsResponse>> UsernameExists([FromRoute] UsernameExistsRequest request)
        => await _mediator.Send(request);
    [AllowAnonymous]
    [HttpGet("current", Name = "GetCurrentUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CurrentUserResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CurrentUserResponse>> GetCurrent()
    {
        return await _mediator.Send(new CurrentUserRequest());
    }
    [HttpPost(Name = "CreateUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateUserResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateUserResponse>> Create([FromBody] CreateUserRequest request)
        => await _mediator.Send(request);
    [HttpGet("page/{pageSize}/{index}", Name = "GetUsersPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetUsersPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetUsersPageResponse>> Page([FromRoute] GetUsersPageRequest request)
        => await _mediator.Send(request);
    [HttpPut(Name = "UpdateUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateUserResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateUserResponse>> Update([FromBody] UpdateUserRequest request)
        => await _mediator.Send(request);
    [HttpDelete("{userId}", Name = "RemoveUserRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(RemoveUserResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<RemoveUserResponse>> Remove([FromRoute] RemoveUserRequest request)
        => await _mediator.Send(request);
    [AllowAnonymous]
    [HttpPost("token", Name = "AuthenticateRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(AuthenticateResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<AuthenticateResponse>> Authenticate([FromBody] AuthenticateRequest request)
        => await _mediator.Send(request);
}

