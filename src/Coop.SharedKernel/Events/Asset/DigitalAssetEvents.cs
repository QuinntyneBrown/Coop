// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Events.Asset;

[MessagePackObject]
public class DigitalAssetCreatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid DigitalAssetId { get; set; }

    [Key(5)]
    public string Name { get; set; } = string.Empty;

    [Key(6)]
    public string ContentType { get; set; } = string.Empty;
}

[MessagePackObject]
public class DigitalAssetDeletedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid DigitalAssetId { get; set; }
}

[MessagePackObject]
public class ThemeUpdatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid ThemeId { get; set; }

    [Key(5)]
    public Guid? ProfileId { get; set; }
}
