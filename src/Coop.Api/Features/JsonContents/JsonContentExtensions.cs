using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class JsonContentExtensions
    {
        public static JsonContentDto ToDto(this JsonContent jsonContent)
        {
            return new()
            {
                JsonContentId = jsonContent?.JsonContentId,
                Name = jsonContent?.Name,
                Json = jsonContent?.Json
            };
        }
    }
}
