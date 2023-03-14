using System;

namespace Coop.Domain.DomainEvents;

public class CreatedNotice : BaseDomainEvent
{
    public string Name { get; private set; }
    public string Body { get; private set; }
    public Guid NoticeId { get; private set; }
    public Guid CreatedByUserId { get; private set; }
    public CreatedNotice(Guid noticeId, string name, string body, Guid createdByUserId)
    {
        NoticeId = noticeId;
        Name = name;
        Body = body;
        CreatedByUserId = createdByUserId;
    }
    private CreatedNotice()
    {
    }
}
