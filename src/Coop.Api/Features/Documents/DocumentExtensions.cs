using System;
using Coop.Api.Models;

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
