// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Application.Features;

public class DocumentDto
{
    public Guid DocumentId { get; set; }
    public Guid? DigitalAssetId { get; set; }
    public string Body { get; set; }
    public string Name { get; set; }
    public DateTime? Published { get; set; }
    public Guid? CreatedById { get; set; }
}

