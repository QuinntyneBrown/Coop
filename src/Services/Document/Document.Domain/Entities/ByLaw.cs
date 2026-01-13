// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Document.Domain.Entities;

public class ByLaw : DocumentBase
{
    private ByLaw() { }

    public ByLaw(string name, Guid digitalAssetId, Guid? createdById = null)
        : base(name, digitalAssetId, createdById)
    {
    }
}
