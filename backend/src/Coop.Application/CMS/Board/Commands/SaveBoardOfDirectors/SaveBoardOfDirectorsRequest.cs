using Coop.Application.CMS.Dtos;
using Coop.Domain.Authorization;
using Coop.Domain.Identity;
using Coop.SharedKernel;
using MediatR;

namespace Coop.Application.CMS.Board.Commands.SaveBoardOfDirectors;

/// <summary>Replaces the whole board list, in order (L2-REQ-086 AC2).</summary>
[AuthorizeResourceOperation(AccessRight.Write, Constants.Aggregates.JsonContent)]
public class SaveBoardOfDirectorsRequest : IRequest<SaveBoardOfDirectorsResponse>
{
    public List<DirectorDto> Directors { get; set; } = new();
}
