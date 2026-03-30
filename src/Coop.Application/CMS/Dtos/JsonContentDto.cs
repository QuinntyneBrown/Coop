using Coop.Domain.CMS;

namespace Coop.Application.CMS.Dtos;

public class JsonContentDto
{
    public Guid JsonContentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Json { get; set; } = string.Empty;

    public static JsonContentDto FromJsonContent(JsonContent jc)
    {
        return new JsonContentDto
        {
            JsonContentId = jc.JsonContentId,
            Name = jc.Name,
            Json = jc.Json
        };
    }
}
