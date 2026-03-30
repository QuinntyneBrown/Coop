using Coop.Application.Documents.Dtos;

namespace Coop.Application.Documents.Queries.GetPublishedByLaws;

public class GetPublishedByLawsResponse
{
    public List<ByLawDto> ByLaws { get; set; } = new();
}
