using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JsonContentController
    {
        private readonly IMediator _mediator;

        public JsonContentController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{jsonContentId}", Name = "GetJsonContentByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentById.Response>> GetById([FromRoute]GetJsonContentById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.JsonContent == null)
            {
                return new NotFoundObjectResult(request.JsonContentId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetJsonContentsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContents.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContents.Response>> Get()
            => await _mediator.Send(new GetJsonContents.Request());
        
        [HttpPost(Name = "CreateJsonContentRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateJsonContent.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateJsonContent.Response>> Create([FromBody]CreateJsonContent.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetJsonContentsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentsPage.Response>> Page([FromRoute]GetJsonContentsPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateJsonContentRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateJsonContent.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateJsonContent.Response>> Update([FromBody]UpdateJsonContent.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{jsonContentId}", Name = "RemoveJsonContentRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveJsonContent.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveJsonContent.Response>> Remove([FromRoute]RemoveJsonContent.Request request)
            => await _mediator.Send(request);
        
    }
}
