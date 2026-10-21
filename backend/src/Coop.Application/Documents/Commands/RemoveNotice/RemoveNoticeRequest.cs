using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Documents.Commands.RemoveNotice;

[OfficeOnly]
public class RemoveNoticeRequest : IRequest<RemoveNoticeResponse> { public Guid DocumentId { get; set; } }
