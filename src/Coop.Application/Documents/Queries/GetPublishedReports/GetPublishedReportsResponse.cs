using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetPublishedReports;

public class GetPublishedReportsResponse
{
    public List<ReportDto> Reports { get; set; } = new();
}
