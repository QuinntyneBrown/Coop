namespace Coop.Domain.Profiles;

public class StaffMember : ProfileBase
{
    public string? JobTitle { get; set; }

    public StaffMember()
    {
        Type = ProfileType.StaffMember;
    }
}
