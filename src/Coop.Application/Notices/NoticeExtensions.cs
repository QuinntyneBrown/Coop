using Coop.Domain.Entities;

namespace Coop.Application.Features;

 public static class NoticeExtensions
 {
     public static NoticeDto ToDto(this Notice notice)
     {
         return new()
         {
             NoticeId = notice.NoticeId,
             DocumentId = notice.DocumentId,
             Name = notice.Name,
             DigitalAssetId = notice.DigitalAssetId,
             Published = notice.Published,
             CreatedById = notice.CreatedById
         };
     }
 }
