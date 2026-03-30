using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetNotices;

public class GetNoticesResponse
{
    public List<NoticeDto> Notices { get; set; } = new();
}
