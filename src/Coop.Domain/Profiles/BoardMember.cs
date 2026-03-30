namespace Coop.Domain.Profiles;

public class BoardMember : ProfileBase
{
    public string BoardTitle { get; set; } = string.Empty;

    public BoardMember()
    {
        ProfileType = ProfileType.BoardMember;
    }
}
