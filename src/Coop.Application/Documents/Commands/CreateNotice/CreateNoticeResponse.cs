using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Commands.CreateNotice;

public class CreateNoticeResponse
{
    public NoticeDto Notice { get; set; } = default!;
}
