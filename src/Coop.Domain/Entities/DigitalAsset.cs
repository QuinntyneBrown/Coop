// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Domain.Entities;

public class DigitalAsset
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; }
    public byte[] Bytes { get; set; }
    public string ContentType { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }
}

