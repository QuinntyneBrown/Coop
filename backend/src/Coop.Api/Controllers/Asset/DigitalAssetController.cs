using Coop.Application.Assets.Commands.CreateDigitalAsset;
using Coop.Application.Assets.Commands.RemoveDigitalAsset;
using Coop.Application.Assets.Queries.GetDigitalAssetById;
using Coop.Application.Assets.Queries.GetDigitalAssetsByRange;
using Coop.Application.Assets.Queries.GetDigitalAssetsPage;
using Coop.Application.Assets.Queries.ServeDigitalAsset;
using Coop.Application.Assets.Queries.ServeDigitalAssetByName;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers.Asset;

[ApiController]
[Route("api/digitalasset")]
[Authorize]
public class DigitalAssetController : ControllerBase
{
    private readonly IMediator _mediator;

    public DigitalAssetController(IMediator mediator) => _mediator = mediator;

    [HttpPost("upload")]
    public async Task<ActionResult<CreateDigitalAssetResponse>> Upload([FromForm] CreateDigitalAssetRequest request)
        => Ok(await _mediator.Send(request));

    [HttpPost("avatar")]
    public async Task<ActionResult<CreateDigitalAssetResponse>> Avatar([FromForm] CreateDigitalAssetRequest request)
        => Ok(await _mediator.Send(request));

    [HttpGet("{id}")]
    public async Task<ActionResult<GetDigitalAssetByIdResponse>> GetById([FromRoute] Guid id)
        => Ok(await _mediator.Send(new GetDigitalAssetByIdRequest { DigitalAssetId = id }));

    [HttpGet("range")]
    public async Task<ActionResult<GetDigitalAssetsByRangeResponse>> GetRange([FromQuery] List<Guid> digitalAssetIds)
        => Ok(await _mediator.Send(new GetDigitalAssetsByRangeRequest { DigitalAssetIds = digitalAssetIds }));

    [HttpGet("page/{pageSize}/{index}")]
    public async Task<ActionResult<GetDigitalAssetsPageResponse>> GetPage([FromRoute] int pageSize, [FromRoute] int index)
        => Ok(await _mediator.Send(new GetDigitalAssetsPageRequest { PageSize = pageSize, Index = index }));

    [HttpGet("serve/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> Serve([FromRoute] Guid id)
    {
        var response = await _mediator.Send(new ServeDigitalAssetRequest { DigitalAssetId = id });
        return File(response.Bytes, response.ContentType, response.Name);
    }

    [HttpGet("by-name/{name}")]
    [AllowAnonymous]
    public async Task<IActionResult> ServeByName([FromRoute] string name)
    {
        var response = await _mediator.Send(new ServeDigitalAssetByNameRequest { Name = name });
        return File(response.Bytes, response.ContentType, response.Name);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<RemoveDigitalAssetResponse>> Remove([FromRoute] Guid id)
        => Ok(await _mediator.Send(new RemoveDigitalAssetRequest { DigitalAssetId = id }));
}
