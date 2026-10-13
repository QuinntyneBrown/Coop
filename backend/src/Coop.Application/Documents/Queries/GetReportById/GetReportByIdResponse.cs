using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetReportById;

public class GetReportByIdResponse
{
    public ReportDto Report { get; set; } = default!;
}
