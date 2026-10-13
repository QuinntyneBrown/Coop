using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetByLawsPage;

public class GetByLawsPageResponse
{
    public List<ByLawDto> ByLaws { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
