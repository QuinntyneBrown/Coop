using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MemberController
    {
        private readonly IMediator _mediator;

        public MemberController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{memberId}", Name = "GetMemberByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMemberById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMemberById.Response>> GetById([FromRoute]GetMemberById.Request request)
        {
            var response = await _mediator.Send(request);
        
            if (response.Member == null)
            {
                return new NotFoundObjectResult(request.MemberId);
            }
        
            return response;
        }
        
        [HttpGet(Name = "GetMembersRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMembers.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMembers.Response>> Get()
            => await _mediator.Send(new GetMembers.Request());
        
        [HttpPost(Name = "CreateMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateMember.Response>> Create([FromBody]CreateMember.Request request)
            => await _mediator.Send(request);
        
        [HttpGet("page/{pageSize}/{index}", Name = "GetMembersPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetMembersPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetMembersPage.Response>> Page([FromRoute]GetMembersPage.Request request)
            => await _mediator.Send(request);
        
        [HttpPut(Name = "UpdateMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateMember.Response>> Update([FromBody]UpdateMember.Request request)
            => await _mediator.Send(request);
        
        [HttpDelete("{memberId}", Name = "RemoveMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveMember.Response>> Remove([FromRoute]RemoveMember.Request request)
            => await _mediator.Send(request);
        
    }
}
