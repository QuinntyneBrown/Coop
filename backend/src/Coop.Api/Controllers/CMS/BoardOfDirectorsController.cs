using Coop.Application.CMS.Board.Commands.SaveBoardOfDirectors;
using Coop.Application.CMS.Board.Queries.GetBoardOfDirectors;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.CMS;

/// <summary>
/// The Board of Directors list the home page shows (L2-REQ-085, L2-REQ-086).
/// Reads are anonymous; saving the list is authorized per request by the
/// JsonContent aggregate privilege.
/// </summary>
[ApiController]
[Route("api/board-of-directors")]
[Authorize]
public class BoardOfDirectorsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BoardOfDirectorsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<GetBoardOfDirectorsResponse>> Get()
        => Ok(await _mediator.Send(new GetBoardOfDirectorsRequest()));

    [HttpPut]
    public async Task<ActionResult<SaveBoardOfDirectorsResponse>> Save([FromBody] SaveBoardOfDirectorsRequest request)
        => Ok(await _mediator.Send(request));
}
