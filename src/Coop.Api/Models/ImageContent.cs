using System;

namespace Coop.Api.Models
{
    public class ImageContent
    {
        public Guid ImageContentId { get; private set; }
        public string Name { get; private set; }
        public Guid DigitalAssetId { get; private set; }
        public ImageContent(string name, Guid digitalAssetId)
        {
            Name = name;
            DigitalAssetId = digitalAssetId;
        }

        private ImageContent()
        {

        }
    }
}
