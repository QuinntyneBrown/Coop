using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffMemberController
    {
        private readonly IMediator _mediator;

        public StaffMemberController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{staffMemberId}", Name = "GetStaffMemberByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetStaffMemberById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetStaffMemberById.Response>> GetById([FromRoute] GetStaffMemberById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.StaffMember == null)
            {
                return new NotFoundObjectResult(request.StaffMemberId);
            }

            return response;
        }

        [HttpGet(Name = "GetStaffMembersRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetStaffMembers.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetStaffMembers.Response>> Get()
            => await _mediator.Send(new GetStaffMembers.Request());

        [HttpPost(Name = "CreateStaffMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateStaffMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateStaffMember.Response>> Create([FromBody] CreateStaffMember.Request request)
            => await _mediator.Send(request);

        [HttpGet("page/{pageSize}/{index}", Name = "GetStaffMembersPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetStaffMembersPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetStaffMembersPage.Response>> Page([FromRoute] GetStaffMembersPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateStaffMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateStaffMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateStaffMember.Response>> Update([FromBody] UpdateStaffMember.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{staffMemberId}", Name = "RemoveStaffMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveStaffMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveStaffMember.Response>> Remove([FromRoute] RemoveStaffMember.Request request)
            => await _mediator.Send(request);

    }
}
