using MediatR;

namespace Coop.Application.Profiles.Commands.UpdateStaffMember;

public class UpdateStaffMemberRequest : IRequest<UpdateStaffMemberResponse>
{
    public Guid ProfileId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? JobTitle { get; set; }
}
