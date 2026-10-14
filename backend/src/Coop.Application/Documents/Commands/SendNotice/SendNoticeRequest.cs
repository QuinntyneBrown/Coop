using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.Documents.Commands.SendNotice;

[AuthorizeResourceOperation(AccessRight.Write, Constants.Aggregates.Notice)]
public class SendNoticeRequest : IRequest<SendNoticeResponse>
{
    public Guid DocumentId { get; set; }
}
