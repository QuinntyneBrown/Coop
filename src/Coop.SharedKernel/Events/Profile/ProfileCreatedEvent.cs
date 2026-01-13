// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Events.Profile;

[MessagePackObject]
public class ProfileCreatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid ProfileId { get; set; }

    [Key(5)]
    public Guid UserId { get; set; }

    [Key(6)]
    public string ProfileType { get; set; } = string.Empty;

    [Key(7)]
    public string FirstName { get; set; } = string.Empty;

    [Key(8)]
    public string LastName { get; set; } = string.Empty;
}

[MessagePackObject]
public class ProfileUpdatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid ProfileId { get; set; }

    [Key(5)]
    public Guid UserId { get; set; }

    [Key(6)]
    public string FirstName { get; set; } = string.Empty;

    [Key(7)]
    public string LastName { get; set; } = string.Empty;
}

[MessagePackObject]
public class ProfileDeletedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid ProfileId { get; set; }

    [Key(5)]
    public Guid UserId { get; set; }
}
