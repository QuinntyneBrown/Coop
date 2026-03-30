using MediatR;

namespace Coop.Application.CMS.Content.Commands.UpdateJsonContent;

public class UpdateJsonContentRequest : IRequest<UpdateJsonContentResponse>
{
    public Guid JsonContentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Json { get; set; } = "{}";
}
