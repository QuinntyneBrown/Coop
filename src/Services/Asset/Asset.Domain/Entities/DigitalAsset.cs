// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Asset.Domain.Entities;

public class DigitalAsset
{
    public Guid DigitalAssetId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public long Size => Bytes?.Length ?? 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
