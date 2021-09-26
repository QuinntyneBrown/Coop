using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class NoticeExtensions
    {
        public static NoticeDto ToDto(this Notice notice)
        {
            return new()
            {
                NoticeId = notice.NoticeId,
                Name = notice.Name,
                PdfDigitalAssetId = notice.PdfDigitalAssetId,
                Published = notice.Published,
                CreatedById = notice.CreatedById
            };
        }

    }
}
