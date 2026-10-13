using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Board.Queries.GetBoardOfDirectors;

public class GetBoardOfDirectorsResponse
{
    public List<DirectorDto> Directors { get; set; } = new();
}
