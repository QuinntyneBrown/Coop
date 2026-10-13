using MediatR;

namespace Coop.Application.Profiles.Queries.GetMemberById;

public class GetMemberByIdRequest : IRequest<GetMemberByIdResponse>
{
    public Guid ProfileId { get; set; }
}
