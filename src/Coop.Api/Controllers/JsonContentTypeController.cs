using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JsonContentTypeController
    {
        private readonly IMediator _mediator;

        public JsonContentTypeController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{jsonContentTypeId}", Name = "GetJsonContentTypeByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentTypeById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentTypeById.Response>> GetById([FromRoute] GetJsonContentTypeById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.JsonContentType == null)
            {
                return new NotFoundObjectResult(request.JsonContentTypeId);
            }

            return response;
        }

        [HttpGet("name/{name}", Name = "GetJsonContentTypeByNameRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentTypeByName.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentTypeByName.Response>> GetByName([FromRoute] GetJsonContentTypeByName.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.JsonContentType == null)
            {
                return new NotFoundObjectResult(request.Name);
            }

            return response;
        }

        [HttpGet(Name = "GetJsonContentTypesRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentTypes.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentTypes.Response>> Get()
            => await _mediator.Send(new GetJsonContentTypes.Request());

        [HttpPost(Name = "CreateJsonContentTypeRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateJsonContentType.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateJsonContentType.Response>> Create([FromBody] CreateJsonContentType.Request request)
            => await _mediator.Send(request);

        [HttpGet("page/{pageSize}/{index}", Name = "GetJsonContentTypesPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentTypesPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentTypesPage.Response>> Page([FromRoute] GetJsonContentTypesPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateJsonContentTypeRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateJsonContentType.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateJsonContentType.Response>> Update([FromBody] UpdateJsonContentType.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{jsonContentTypeId}", Name = "RemoveJsonContentTypeRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveJsonContentType.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveJsonContentType.Response>> Remove([FromRoute] RemoveJsonContentType.Request request)
            => await _mediator.Send(request);

    }
}
