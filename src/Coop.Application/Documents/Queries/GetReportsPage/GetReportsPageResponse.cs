using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetReportsPage;

public class GetReportsPageResponse
{
    public List<ReportDto> Reports { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
