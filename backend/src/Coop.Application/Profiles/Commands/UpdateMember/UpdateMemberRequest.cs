using MediatR;

namespace Coop.Application.Profiles.Commands.UpdateMember;

public class UpdateMemberRequest : IRequest<UpdateMemberResponse>
{
    public Guid ProfileId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? UnitNumber { get; set; }
}
