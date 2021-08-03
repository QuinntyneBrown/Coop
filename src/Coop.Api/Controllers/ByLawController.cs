using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ByLawController
    {
        private readonly IMediator _mediator;

        public ByLawController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{byLawId}", Name = "GetByLawByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetByLawById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetByLawById.Response>> GetById([FromRoute]GetByLawById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.ByLaw == null)
            {
                return new NotFoundObjectResult(request.ByLawId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetByLawsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetByLaws.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetByLaws.Response>> Get()
            => await _mediator.Send(new GetByLaws.Request());
        
        [HttpPost(Name = "CreateByLawRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateByLaw.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateByLaw.Response>> Create([FromBody]CreateByLaw.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetByLawsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetByLawsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetByLawsPage.Response>> Page([FromRoute]GetByLawsPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateByLawRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateByLaw.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateByLaw.Response>> Update([FromBody]UpdateByLaw.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{byLawId}", Name = "RemoveByLawRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveByLaw.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveByLaw.Response>> Remove([FromRoute]RemoveByLaw.Request request)
            => await _mediator.Send(request);
        
    }
}
