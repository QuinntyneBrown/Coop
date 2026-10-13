namespace Coop.Domain.Profiles;

public class Member : ProfileBase
{
    public string? UnitNumber { get; set; }

    public Member()
    {
        Type = ProfileType.Member;
    }
}
