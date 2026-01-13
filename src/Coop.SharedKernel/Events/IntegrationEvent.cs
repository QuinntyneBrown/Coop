// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Events;

[MessagePackObject]
public abstract class IntegrationEvent
{
    [Key(0)]
    public Guid EventId { get; set; } = Guid.NewGuid();

    [Key(1)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Key(2)]
    public string? CorrelationId { get; set; }

    [Key(3)]
    public string EventType => GetType().Name;
}
