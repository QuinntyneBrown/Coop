using MediatR;

namespace Coop.Application.Identity.Queries.GetUserById;

public class GetUserByIdRequest : IRequest<GetUserByIdResponse>
{
    public Guid UserId { get; set; }
}
