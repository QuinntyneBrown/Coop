using System;
using Coop.Core.Models;

namespace Coop.Api.Features
{
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
}
