using MediatR;

namespace Coop.Application.Identity.Queries.UsernameExists;

public class UsernameExistsRequest : IRequest<UsernameExistsResponse>
{
    public string Username { get; set; } = string.Empty;
}
