using System;
using Coop.Domain.Entities;

namespace Coop.Application.Features;

 public static class DocumentExtensions
 {
     public static DocumentDto ToDto(this Document document)
     {
         return new()
         {
             DocumentId = document.DocumentId
         };
     }
 }
