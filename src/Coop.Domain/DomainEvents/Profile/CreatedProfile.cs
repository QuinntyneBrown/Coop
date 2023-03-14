// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Domain.DomainEvents;

public class CreatedProfile : BaseDomainEvent
{
    public Guid UserId { get; set; }
    public Guid ProfileId { get; set; }
}

