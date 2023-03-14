// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.DomainEvents;
using System;

namespace Coop.Domain.Entities;

public class Notice : Document
{
    public Guid NoticeId { get; private set; }
    public Notice(Coop.Domain.DomainEvents.CreateDocument @event)
        : base(@event)
    {
    }
    private Notice()
    {
    }
}

