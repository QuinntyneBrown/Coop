// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Events.Document;

[MessagePackObject]
public class DocumentCreatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid DocumentId { get; set; }

    [Key(5)]
    public string Name { get; set; } = string.Empty;

    [Key(6)]
    public string DocumentType { get; set; } = string.Empty;

    [Key(7)]
    public Guid DigitalAssetId { get; set; }

    [Key(8)]
    public Guid CreatedById { get; set; }
}

[MessagePackObject]
public class DocumentUpdatedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid DocumentId { get; set; }

    [Key(5)]
    public string Name { get; set; } = string.Empty;

    [Key(6)]
    public string DocumentType { get; set; } = string.Empty;
}

[MessagePackObject]
public class DocumentDeletedEvent : IntegrationEvent
{
    [Key(4)]
    public Guid DocumentId { get; set; }

    [Key(5)]
    public string DocumentType { get; set; } = string.Empty;
}
