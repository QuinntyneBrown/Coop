using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class NoticeExtensions
    {
        public static NoticeDto ToDto(this Notice notice)
        {
            return new ()
            {
                NoticeId = notice.NoticeId
            };
        }
        
    }
}
