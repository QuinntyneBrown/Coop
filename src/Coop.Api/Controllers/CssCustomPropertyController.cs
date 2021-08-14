using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CssCustomPropertyController
    {
        private readonly IMediator _mediator;

        public CssCustomPropertyController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{cssCustomPropertyId}", Name = "GetCssCustomPropertyByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetCssCustomPropertyById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetCssCustomPropertyById.Response>> GetById([FromRoute]GetCssCustomPropertyById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.CssCustomProperty == null)
            {
                return new NotFoundObjectResult(request.CssCustomPropertyId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetCssCustomPropertiesRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetCssCustomProperties.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetCssCustomProperties.Response>> Get()
            => await _mediator.Send(new GetCssCustomProperties.Request());
        
        [HttpPost(Name = "CreateCssCustomPropertyRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateCssCustomProperty.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateCssCustomProperty.Response>> Create([FromBody]CreateCssCustomProperty.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetCssCustomPropertiesPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetCssCustomPropertiesPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetCssCustomPropertiesPage.Response>> Page([FromRoute]GetCssCustomPropertiesPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateCssCustomPropertyRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateCssCustomProperty.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateCssCustomProperty.Response>> Update([FromBody]UpdateCssCustomProperty.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{cssCustomPropertyId}", Name = "RemoveCssCustomPropertyRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveCssCustomProperty.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveCssCustomProperty.Response>> Remove([FromRoute]RemoveCssCustomProperty.Request request)
            => await _mediator.Send(request);
        
    }
}
