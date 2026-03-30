using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetByLaws;

public class GetByLawsResponse
{
    public List<ByLawDto> ByLaws { get; set; } = new();
}
