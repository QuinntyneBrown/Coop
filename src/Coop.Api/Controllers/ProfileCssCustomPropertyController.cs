using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileCssCustomPropertyController
    {
        private readonly IMediator _mediator;

        public ProfileCssCustomPropertyController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{profileCssCustomPropertyId}", Name = "GetProfileCssCustomPropertyByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetProfileCssCustomPropertyById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetProfileCssCustomPropertyById.Response>> GetById([FromRoute] GetProfileCssCustomPropertyById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.ProfileCssCustomProperty == null)
            {
                return new NotFoundObjectResult(request.ProfileCssCustomPropertyId);
            }

            return response;
        }

        [HttpGet(Name = "GetProfileCssCustomPropertiesRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetProfileCssCustomProperties.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetProfileCssCustomProperties.Response>> Get()
            => await _mediator.Send(new GetProfileCssCustomProperties.Request());

        [HttpGet("current", Name = "GetCurrentProfileCssCustomPropertiesRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetCurrentProfileCssCustomProperties.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetCurrentProfileCssCustomProperties.Response>> GetCurrent()
            => await _mediator.Send(new GetCurrentProfileCssCustomProperties.Request());

        [HttpPost(Name = "CreateProfileCssCustomPropertyRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateProfileCssCustomProperty.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateProfileCssCustomProperty.Response>> Create([FromBody] CreateProfileCssCustomProperty.Request request)
            => await _mediator.Send(request);

        [HttpGet("page/{pageSize}/{index}", Name = "GetProfileCssCustomPropertiesPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetProfileCssCustomPropertiesPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetProfileCssCustomPropertiesPage.Response>> Page([FromRoute] GetProfileCssCustomPropertiesPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateProfileCssCustomPropertyRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateProfileCssCustomProperty.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateProfileCssCustomProperty.Response>> Update([FromBody] UpdateProfileCssCustomProperty.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{profileCssCustomPropertyId}", Name = "RemoveProfileCssCustomPropertyRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveProfileCssCustomProperty.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveProfileCssCustomProperty.Response>> Remove([FromRoute] RemoveProfileCssCustomProperty.Request request)
            => await _mediator.Send(request);

    }
}
