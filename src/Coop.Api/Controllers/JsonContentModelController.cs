using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JsonContentModelController
    {
        private readonly IMediator _mediator;

        public JsonContentModelController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{jsonContentModelId}", Name = "GetJsonContentModelByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentModelById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentModelById.Response>> GetById([FromRoute]GetJsonContentModelById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.JsonContentModel == null)
            {
                return new NotFoundObjectResult(request.JsonContentModelId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetJsonContentModelsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentModels.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentModels.Response>> Get()
            => await _mediator.Send(new GetJsonContentModels.Request());
        
        [HttpPost(Name = "CreateJsonContentModelRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateJsonContentModel.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateJsonContentModel.Response>> Create([FromBody]CreateJsonContentModel.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetJsonContentModelsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetJsonContentModelsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetJsonContentModelsPage.Response>> Page([FromRoute]GetJsonContentModelsPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateJsonContentModelRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateJsonContentModel.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateJsonContentModel.Response>> Update([FromBody]UpdateJsonContentModel.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{jsonContentModelId}", Name = "RemoveJsonContentModelRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveJsonContentModel.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveJsonContentModel.Response>> Remove([FromRoute]RemoveJsonContentModel.Request request)
            => await _mediator.Send(request);
        
    }
}
