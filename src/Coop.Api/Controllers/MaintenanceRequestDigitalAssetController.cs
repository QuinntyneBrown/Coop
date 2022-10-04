using System.Net;
using System.Threading.Tasks;
using Coop.Application.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceRequestDigitalAssetController
    {
        private readonly IMediator _mediator;

        public MaintenanceRequestDigitalAssetController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{maintenanceRequestDigitalAssetId}", Name = "GetMaintenanceRequestDigitalAssetByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequestDigitalAssetById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequestDigitalAssetById.Response>> GetById([FromRoute] GetMaintenanceRequestDigitalAssetById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.MaintenanceRequestDigitalAsset == null)
            {
                return new NotFoundObjectResult(request.MaintenanceRequestDigitalAssetId);
            }

            return response;
        }

        [HttpGet(Name = "GetMaintenanceRequestDigitalAssetsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequestDigitalAssets.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequestDigitalAssets.Response>> Get()
            => await _mediator.Send(new GetMaintenanceRequestDigitalAssets.Request());

        [HttpPost(Name = "CreateMaintenanceRequestDigitalAssetRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateMaintenanceRequestDigitalAsset.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateMaintenanceRequestDigitalAsset.Response>> Create([FromBody] CreateMaintenanceRequestDigitalAsset.Request request)
            => await _mediator.Send(request);

        [HttpGet("page/{pageSize}/{index}", Name = "GetMaintenanceRequestDigitalAssetsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequestDigitalAssetsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequestDigitalAssetsPage.Response>> Page([FromRoute] GetMaintenanceRequestDigitalAssetsPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateMaintenanceRequestDigitalAssetRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateMaintenanceRequestDigitalAsset.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateMaintenanceRequestDigitalAsset.Response>> Update([FromBody] UpdateMaintenanceRequestDigitalAsset.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{maintenanceRequestDigitalAssetId}", Name = "RemoveMaintenanceRequestDigitalAssetRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveMaintenanceRequestDigitalAsset.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveMaintenanceRequestDigitalAsset.Response>> Remove([FromRoute] RemoveMaintenanceRequestDigitalAsset.Request request)
            => await _mediator.Send(request);

    }
}
