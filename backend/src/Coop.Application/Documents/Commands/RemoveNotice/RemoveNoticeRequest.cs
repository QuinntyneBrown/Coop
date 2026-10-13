using MediatR;

namespace Coop.Application.Documents.Commands.RemoveNotice;

public class RemoveNoticeRequest : IRequest<RemoveNoticeResponse> { public Guid DocumentId { get; set; } }
