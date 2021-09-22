using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnCallController
    {
        private readonly IMediator _mediator;

        public OnCallController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{onCallId}", Name = "GetOnCallByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetOnCallById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetOnCallById.Response>> GetById([FromRoute] GetOnCallById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.OnCall == null)
            {
                return new NotFoundObjectResult(request.OnCallId);
            }

            return response;
        }

        [HttpGet(Name = "GetOnCallsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetOnCalls.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetOnCalls.Response>> Get()
            => await _mediator.Send(new GetOnCalls.Request());


        [HttpGet("page/{pageSize}/{index}", Name = "GetOnCallsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetOnCallsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetOnCallsPage.Response>> Page([FromRoute] GetOnCallsPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateOnCallRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateOnCall.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateOnCall.Response>> Update([FromBody] UpdateOnCall.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{onCallId}", Name = "RemoveOnCallRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveOnCall.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveOnCall.Response>> Remove([FromRoute] RemoveOnCall.Request request)
            => await _mediator.Send(request);

    }
}
