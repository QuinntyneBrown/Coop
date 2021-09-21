using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvitationTokenController
    {
        private readonly IMediator _mediator;

        public InvitationTokenController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{invitationTokenId}", Name = "GetInvitationTokenByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetInvitationTokenById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetInvitationTokenById.Response>> GetById([FromRoute]GetInvitationTokenById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.InvitationToken == null)
            {
                return new NotFoundObjectResult(request.InvitationTokenId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetInvitationTokensRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetInvitationTokens.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetInvitationTokens.Response>> Get()
            => await _mediator.Send(new GetInvitationTokens.Request());
        
        [HttpPost(Name = "CreateInvitationTokenRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateInvitationToken.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateInvitationToken.Response>> Create([FromBody]CreateInvitationToken.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetInvitationTokensPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetInvitationTokensPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetInvitationTokensPage.Response>> Page([FromRoute]GetInvitationTokensPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateInvitationTokenRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateInvitationTokenExpiry.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateInvitationTokenExpiry.Response>> Update([FromBody]UpdateInvitationTokenExpiry.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{invitationTokenId}", Name = "RemoveInvitationTokenRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveInvitationToken.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveInvitationToken.Response>> Remove([FromRoute]RemoveInvitationToken.Request request)
            => await _mediator.Send(request);
        
    }
}
