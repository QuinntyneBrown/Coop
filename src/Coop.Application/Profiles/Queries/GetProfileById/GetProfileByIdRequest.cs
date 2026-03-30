using MediatR;

namespace Coop.Application.Profiles.Queries.GetProfileById;

public class GetProfileByIdRequest : IRequest<GetProfileByIdResponse>
{
    public Guid ProfileId { get; set; }
}
