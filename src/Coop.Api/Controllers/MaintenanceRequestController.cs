using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [Authorize]
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
        public async Task<ActionResult<GetMaintenanceRequestById.Response>> GetById([FromRoute]GetMaintenanceRequestById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.MaintenanceRequest == null)
            {
                return new NotFoundObjectResult(request.MaintenanceRequestId);
            }
        
            return response;
        }

        [HttpGet("my", Name = "GetCurrentUserMaintenanceRequestsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetCurrentUserMaintenanceRequests.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetCurrentUserMaintenanceRequests.Response>> GetByCurrentProfile()
            => await _mediator.Send(new GetCurrentUserMaintenanceRequests.Request());

        [HttpGet(Name = "GetMaintenanceRequestsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequests.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequests.Response>> Get()
            => await _mediator.Send(new GetMaintenanceRequests.Request());
                
        [HttpGet("page/{pageSize}/{index}", Name = "GetMaintenanceRequestsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMaintenanceRequestsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMaintenanceRequestsPage.Response>> Page([FromRoute]GetMaintenanceRequestsPage.Request request)
            => await _mediator.Send(request);
                
        [HttpDelete("{maintenanceRequestId}", Name = "RemoveMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveMaintenanceRequest.Response>> Remove([FromRoute]RemoveMaintenanceRequest.Request request)
            => await _mediator.Send(request);

        [HttpPost(Name = "CreateMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateMaintenanceRequest.Response>> Create([FromBody] CreateMaintenanceRequest.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateMaintenanceRequestDescriptionRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateMaintenanceRequestDescription.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateMaintenanceRequestDescription.Response>> Update([FromBody] UpdateMaintenanceRequestDescription.Request request)
            => await _mediator.Send(request);

        [HttpPut("work-details", Name = "UpdateMaintenanceRequestWorkDetailsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateMaintenanceRequestWorkDetails.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateMaintenanceRequestWorkDetails.Response>> UpdateWorkDetails([FromBody] UpdateMaintenanceRequestWorkDetails.Request request)
            => await _mediator.Send(request);

        [HttpPut("start", Name = "StartMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(StartMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<StartMaintenanceRequest.Response>> Start([FromBody] StartMaintenanceRequest.Request request)
            => await _mediator.Send(request);

        [HttpPut("receive", Name = "ReceiveMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ReceiveMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<ReceiveMaintenanceRequest.Response>> Receive([FromBody] ReceiveMaintenanceRequest.Request request)
            => await _mediator.Send(request);

        [HttpPut("complete",Name = "CompleteMaintenanceRequestRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CompleteMaintenanceRequest.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CompleteMaintenanceRequest.Response>> Complete([FromBody] CompleteMaintenanceRequest.Request request)
            => await _mediator.Send(request);
    }
}
