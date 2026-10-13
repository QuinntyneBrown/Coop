using MediatR;

namespace Coop.Application.Profiles.Commands.CreateBoardMember;

public class CreateBoardMemberRequest : IRequest<CreateBoardMemberResponse>
{
    public Guid? UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Title { get; set; }
    public string? BoardTitle { get; set; }
}
