using System;

namespace Coop.Api.Features
{
    public class NoticeDto
    {
        public Guid NoticeId { get; set; }
        public string Name { get; set; }
        public string Body { get; set; }
        public Guid CreatedById { get; set; }
    }
}
