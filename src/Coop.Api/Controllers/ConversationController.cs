using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConversationController
    {
        private readonly IMediator _mediator;

        public ConversationController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{conversationId}", Name = "GetConversationByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetConversationById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetConversationById.Response>> GetById([FromRoute]GetConversationById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.Conversation == null)
            {
                return new NotFoundObjectResult(request.ConversationId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetConversationsRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetConversations.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetConversations.Response>> Get()
            => await _mediator.Send(new GetConversations.Request());
        
        [HttpPost(Name = "CreateConversationRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateConversation.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateConversation.Response>> Create([FromBody]CreateConversation.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetConversationsPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetConversationsPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetConversationsPage.Response>> Page([FromRoute]GetConversationsPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateConversationRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateConversation.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateConversation.Response>> Update([FromBody]UpdateConversation.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{conversationId}", Name = "RemoveConversationRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveConversation.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveConversation.Response>> Remove([FromRoute]RemoveConversation.Request request)
            => await _mediator.Send(request);
        
    }
}
