using System.Net;
using System.Threading.Tasks;
using Coop.Api.Features;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NoticeController
    {
        private readonly IMediator _mediator;

        public NoticeController(IMediator mediator)
            => _mediator = mediator;

        [HttpGet("{noticeId}", Name = "GetNoticeByIdRoute")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetNoticeById.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetNoticeById.Response>> GetById([FromRoute] GetNoticeById.Request request)
        {
            var response = await _mediator.Send(request);

            if (response.Notice == null)
            {
                return new NotFoundObjectResult(request.NoticeId);
            }

            return response;
        }

        [HttpGet(Name = "GetNoticesRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetNotices.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetNotices.Response>> Get()
            => await _mediator.Send(new GetNotices.Request());

        [HttpGet("published", Name = "GetPublishedNoticesRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetPublishedNotices.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetPublishedNotices.Response>> GetPublished()
            => await _mediator.Send(new GetPublishedNotices.Request());

        [HttpPost(Name = "CreateNoticeRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(CreateNotice.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CreateNotice.Response>> Create([FromBody] CreateNotice.Request request)
            => await _mediator.Send(request);

        [HttpGet("page/{pageSize}/{index}", Name = "GetNoticesPageRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(GetNoticesPage.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<GetNoticesPage.Response>> Page([FromRoute] GetNoticesPage.Request request)
            => await _mediator.Send(request);

        [HttpPut(Name = "UpdateNoticeRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(UpdateNotice.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UpdateNotice.Response>> Update([FromBody] UpdateNotice.Request request)
            => await _mediator.Send(request);

        [HttpDelete("{noticeId}", Name = "RemoveNoticeRoute")]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(RemoveNotice.Response), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<RemoveNotice.Response>> Remove([FromRoute] RemoveNotice.Request request)
            => await _mediator.Send(request);

    }
}
