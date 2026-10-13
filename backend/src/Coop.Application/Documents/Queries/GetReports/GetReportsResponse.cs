using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetReports;

public class GetReportsResponse
{
    public List<ReportDto> Reports { get; set; } = new();
}
