using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FragmentController
    {
        private readonly IMediator _mediator;

        public FragmentController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{fragmentId}", Name = "GetFragmentByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetFragmentById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetFragmentById.Response>> GetById([FromRoute]GetFragmentById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.Fragment == null)
            {
                return new NotFoundObjectResult(request.FragmentId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetFragmentsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetFragments.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetFragments.Response>> Get()
            => await _mediator.Send(new GetFragments.Request());
        
        [HttpPost(Name = "CreateFragmentRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateFragment.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateFragment.Response>> Create([FromBody]CreateFragment.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetFragmentsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetFragmentsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetFragmentsPage.Response>> Page([FromRoute]GetFragmentsPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateFragmentRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateFragment.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateFragment.Response>> Update([FromBody]UpdateFragment.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{fragmentId}", Name = "RemoveFragmentRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveFragment.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveFragment.Response>> Remove([FromRoute]RemoveFragment.Request request)
            => await _mediator.Send(request);
        
    }
}
