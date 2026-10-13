using MediatR;

namespace Coop.Application.CMS.Themes.Queries.GetThemeByProfile;

public class GetThemeByProfileRequest : IRequest<GetThemeByProfileResponse>
{
    public Guid ProfileId { get; set; }
}
