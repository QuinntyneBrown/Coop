// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;

namespace Coop.Domain.Entities;

public class Conversation
{
    public Guid ConversationId { get; set; }
    public List<Profile> Profiles { get; private set; } = new();
    public List<Message> Messages { get; private set; } = new();
    public DateTime Created { get; private set; } = DateTime.UtcNow;
}

