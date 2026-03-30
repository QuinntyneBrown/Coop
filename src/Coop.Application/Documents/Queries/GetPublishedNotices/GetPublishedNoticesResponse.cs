using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetPublishedNotices;

public class GetPublishedNoticesResponse
{
    public List<NoticeDto> Notices { get; set; } = new();
}
