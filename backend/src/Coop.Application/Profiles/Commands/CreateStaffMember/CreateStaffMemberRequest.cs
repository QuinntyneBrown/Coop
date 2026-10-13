using MediatR;

namespace Coop.Application.Profiles.Commands.CreateStaffMember;

public class CreateStaffMemberRequest : IRequest<CreateStaffMemberResponse>
{
    public Guid? UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? JobTitle { get; set; }
}
