namespace Coop.Domain.Profiles;

public class BoardMember : ProfileBase
{
    public string? Title { get; set; }
    public string? BoardTitle { get; set; }

    public BoardMember()
    {
        Type = ProfileType.BoardMember;
    }
}
