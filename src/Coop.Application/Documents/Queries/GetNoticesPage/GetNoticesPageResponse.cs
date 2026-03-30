using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetNoticesPage;

public class GetNoticesPageResponse
{
    public List<NoticeDto> Notices { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
