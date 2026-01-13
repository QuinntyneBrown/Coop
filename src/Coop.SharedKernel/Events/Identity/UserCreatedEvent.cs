// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Events.Identity;

[MessagePackObject]
public class UserCreatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid UserId { get; set; }

    [Key(5)]
    public string Username { get; set; } = string.Empty;

    [Key(6)]
    public List<string> Roles { get; set; } = new();
}

[MessagePackObject]
public class UserDeletedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid UserId { get; set; }
}

[MessagePackObject]
public class UserRoleChangedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid UserId { get; set; }

    [Key(5)]
    public List<string> Roles { get; set; } = new();
}
