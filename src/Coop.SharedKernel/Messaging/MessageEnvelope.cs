// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MessagePack;

namespace Coop.SharedKernel.Messaging;

[MessagePackObject]
public class MessageEnvelope
{
    [Key(0)]
    public string EventType { get; set; } = string.Empty;

    [Key(1)]
    public byte[] Payload { get; set; } = Array.Empty<byte>();

    [Key(2)]
    public DateTime Timestamp { get; set; }

    [Key(3)]
    public string? CorrelationId { get; set; }
}
