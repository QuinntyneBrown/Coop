using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class ImageContentExtensions
    {
        public static ImageContentDto ToDto(this ImageContent imageContent)
        {
            return new ()
            {
                ImageContentId = imageContent.ImageContentId
            };
        }
        
    }
}
