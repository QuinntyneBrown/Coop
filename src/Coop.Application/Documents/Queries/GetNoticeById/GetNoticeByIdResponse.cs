using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetNoticeById;

public class GetNoticeByIdResponse
{
    public NoticeDto Notice { get; set; } = default!;
}
