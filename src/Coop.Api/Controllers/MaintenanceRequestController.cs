using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceRequestController
    {
        private readonly IMediator _mediator;

        public MaintenanceRequestController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{maintenanceRequestId}", Name = "GetMaintenanceRequestByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequestById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequestById.Response>> GetById([FromRoute] GetMaintenanceRequestById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.MaintenanceRequest == null)
            {
                return new NotFoundObjectResult(request.MaintenanceRequestId);
            }

            return response;
        }

        [HttpGet(Name = "GetMaintenanceRequestsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequests.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequests.Response>> Get()
            => await _mediator.Send(new GetMaintenanceRequests.Request());

        [HttpPost(Name = "CreateMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateMaintenanceRequest.Response>> Create([FromBody] CreateMaintenanceRequest.Request request)
            => await _mediator.Send(request);

        [HttpGet("page/{pageSize}/{index}", Name = "GetMaintenanceRequestsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequestsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequestsPage.Response>> Page([FromRoute] GetMaintenanceRequestsPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateMaintenanceRequest.Response>> Update([FromBody] UpdateMaintenanceRequest.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{maintenanceRequestId}", Name = "RemoveMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveMaintenanceRequest.Response>> Remove([FromRoute] RemoveMaintenanceRequest.Request request)
            => await _mediator.Send(request);

    }
}
