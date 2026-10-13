using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Commands.SendNotice;

public class SendNoticeResponse
{
    public NoticeDto Notice { get; set; } = default!;
}
