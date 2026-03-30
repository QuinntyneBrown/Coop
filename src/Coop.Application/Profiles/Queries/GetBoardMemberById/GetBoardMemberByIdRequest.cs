using MediatR;

namespace Coop.Application.Profiles.Queries.GetBoardMemberById;

public class GetBoardMemberByIdRequest : IRequest<GetBoardMemberByIdResponse>
{
    public Guid ProfileId { get; set; }
}
