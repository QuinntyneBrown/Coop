using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Board.Commands.SaveBoardOfDirectors;

public class SaveBoardOfDirectorsResponse
{
    public List<DirectorDto> Directors { get; set; } = new();
}
