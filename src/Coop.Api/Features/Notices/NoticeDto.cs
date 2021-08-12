using System;

namespace Coop.Api.Features
{
    public class NoticeDto: DocumentDto
    {
        public Guid NoticeId { get; set; }
        public string Body { get; set; }
        public Guid CreatedById { get; set; }
    }
}
