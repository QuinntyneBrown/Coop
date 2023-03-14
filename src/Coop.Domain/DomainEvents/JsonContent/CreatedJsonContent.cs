// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Domain.DomainEvents;

public class CreatedJsonContent : BaseDomainEvent
{
    public Guid JsonContentId { get; set; }
    public string Name { get; set; }
}

