using Coop.Domain.Entities;

namespace Coop.Application.JsonContents;

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
