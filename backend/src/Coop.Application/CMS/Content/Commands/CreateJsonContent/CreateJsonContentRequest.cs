using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.CMS.Content.Commands.CreateJsonContent;

[OfficeOnly]
public class CreateJsonContentRequest : IRequest<CreateJsonContentResponse>
{
    public string Name { get; set; } = string.Empty;
    public string Json { get; set; } = "{}";
}
