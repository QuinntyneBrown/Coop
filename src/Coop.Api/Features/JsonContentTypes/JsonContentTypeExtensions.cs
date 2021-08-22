using Coop.Api.Models;
using System.Linq;

namespace Coop.Api.Features
{
    public static class JsonContentTypeExtensions
    {
        public static JsonContentTypeDto ToDto(this JsonContentType jsonContentType)
        {
            return new ()
            {
                JsonContentTypeId = jsonContentType.JsonContentTypeId,
                Name = jsonContentType.Name,
                JsonContents = jsonContentType.JsonContents?.Select(x => x.ToDto()).ToList(),
                JsonContent = jsonContentType.JsonContent?.ToDto()
            };
        }
        
    }
}
