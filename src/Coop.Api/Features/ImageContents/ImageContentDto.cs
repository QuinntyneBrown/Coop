using System;

namespace Coop.Api.Features
{
    public class ImageContentDto
    {
        public Guid ImageContentId { get; set; }
        public string Name { get; set; }
        public Guid DigitalAssetId { get; set; }
    }
}
