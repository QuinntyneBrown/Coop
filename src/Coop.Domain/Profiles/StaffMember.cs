namespace Coop.Domain.Profiles;

public class StaffMember : ProfileBase
{
    public string JobTitle { get; set; } = string.Empty;

    public StaffMember()
    {
        ProfileType = ProfileType.StaffMember;
    }
}
