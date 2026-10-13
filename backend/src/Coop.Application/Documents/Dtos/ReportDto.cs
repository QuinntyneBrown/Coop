using Coop.Domain.Documents;

namespace Coop.Application.Documents.Dtos;

public class ReportDto : DocumentDto
{
    public string? Body { get; set; }

    public static ReportDto FromReport(Report report)
    {
        return new ReportDto
        {
            DocumentId = report.DocumentId,
            Name = report.Name,
            DigitalAssetId = report.DigitalAssetId,
            CreatedOn = report.CreatedOn,
            Published = report.Published,
            Body = report.Body
        };
    }
}
