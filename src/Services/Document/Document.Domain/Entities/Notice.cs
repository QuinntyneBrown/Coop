// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Document.Domain.Entities;

public class Notice : DocumentBase
{
    private Notice() { }

    public Notice(string name, Guid digitalAssetId, Guid? createdById = null)
        : base(name, digitalAssetId, createdById)
    {
    }
}
