using MediatR;

namespace Coop.Application.Profiles.Queries.GetProfilesByUserId;

public class GetProfilesByUserIdRequest : IRequest<GetProfilesByUserIdResponse>
{
    public Guid UserId { get; set; }
}
