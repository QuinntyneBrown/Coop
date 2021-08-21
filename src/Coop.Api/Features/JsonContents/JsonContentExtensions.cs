using System;
using Coop.Api.Models;
using Newtonsoft.Json;

namespace Coop.Api.Features
{
    public static class JsonContentExtensions
    {
        public static JsonContentDto ToDto(this JsonContent jsonContent)
        {
            return new ()
            {
                JsonContentId = jsonContent.JsonContentId,
                Json = jsonContent.Json
            };
        }
        
    }
}
