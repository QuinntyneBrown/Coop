using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class HtmlContentExtensions
    {
        public static HtmlContentDto ToDto(this HtmlContent htmlContent)
        {
            return new()
            {
                HtmlContentId = htmlContent.HtmlContentId
            };
        }

    }
}
