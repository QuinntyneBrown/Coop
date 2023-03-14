// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Domain.DomainEvents;

public class CreatedUser : BaseDomainEvent
{
    public Guid UserId { get; private set; }
    public CreatedUser(Guid userId)
    {
        UserId = userId;
    }
}

