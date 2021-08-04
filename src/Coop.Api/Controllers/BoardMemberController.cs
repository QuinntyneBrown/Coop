using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardMemberController
    {
        private readonly IMediator _mediator;

        public BoardMemberController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{boardMemberId}", Name = "GetBoardMemberByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoardMemberById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoardMemberById.Response>> GetById([FromRoute] GetBoardMemberById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.BoardMember == null)
            {
                return new NotFoundObjectResult(request.BoardMemberId);
            }

            return response;
        }

        [HttpGet(Name = "GetBoardMembersRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoardMembers.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoardMembers.Response>> Get()
            => await _mediator.Send(new GetBoardMembers.Request());

        [HttpPost(Name = "CreateBoardMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateBoardMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateBoardMember.Response>> Create([FromBody] CreateBoardMember.Request request)
            => await _mediator.Send(request);

        [HttpGet("page/{pageSize}/{index}", Name = "GetBoardMembersPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetBoardMembersPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetBoardMembersPage.Response>> Page([FromRoute] GetBoardMembersPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateBoardMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateBoardMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateBoardMember.Response>> Update([FromBody] UpdateBoardMember.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{boardMemberId}", Name = "RemoveBoardMemberRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveBoardMember.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveBoardMember.Response>> Remove([FromRoute] RemoveBoardMember.Request request)
            => await _mediator.Send(request);

    }
}
