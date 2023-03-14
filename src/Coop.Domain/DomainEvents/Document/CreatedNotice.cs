// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

