// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.DomainEvents;
using System;

namespace Coop.Domain.Entities;

public class ByLaw : Document
{
    public Guid ByLawId { get; private set; }
    public ByLaw(Coop.Domain.DomainEvents.CreateDocument @event)
        : base(@event)
    {
    }
    private ByLaw()
    {
    }
}

