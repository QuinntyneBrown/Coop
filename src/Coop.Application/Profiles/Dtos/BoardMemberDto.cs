using Coop.Domain.Profiles;

namespace Coop.Application.Profiles.Dtos;

public class BoardMemberDto : ProfileDto
{
    public string? Title { get; set; }
    public string? BoardTitle { get; set; }

    public static BoardMemberDto FromBoardMember(BoardMember boardMember)
    {
        return new BoardMemberDto
        {
            ProfileId = boardMember.ProfileId,
            UserId = boardMember.UserId,
            Firstname = boardMember.Firstname,
            Lastname = boardMember.Lastname,
            PhoneNumber = boardMember.PhoneNumber,
            Email = boardMember.Email,
            AvatarDigitalAssetId = boardMember.AvatarDigitalAssetId,
            Type = boardMember.Type,
            Fullname = boardMember.Fullname,
            Title = boardMember.Title,
            BoardTitle = boardMember.BoardTitle
        };
    }
}
