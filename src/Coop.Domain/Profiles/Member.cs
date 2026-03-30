using Coop.Domain.Profiles.ValueObjects;

namespace Coop.Domain.Profiles;

public class Member : ProfileBase
{
    public Address Address { get; set; } = new();

    public Member()
    {
        ProfileType = ProfileType.Member;
    }
}
