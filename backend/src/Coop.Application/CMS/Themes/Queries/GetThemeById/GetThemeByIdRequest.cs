using MediatR;

namespace Coop.Application.CMS.Themes.Queries.GetThemeById;

public class GetThemeByIdRequest : IRequest<GetThemeByIdResponse>
{
    public Guid ThemeId { get; set; }
}
