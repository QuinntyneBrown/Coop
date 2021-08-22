using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class JsonContentModelExtensions
    {
        public static JsonContentModelDto ToDto(this JsonContentModel jsonContentModel)
        {
            return new ()
            {
                JsonContentModelId = jsonContentModel.JsonContentModelId
            };
        }
        
    }
}
