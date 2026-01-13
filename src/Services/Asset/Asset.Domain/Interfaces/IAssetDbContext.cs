// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Asset.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Asset.Domain.Interfaces;

public interface IAssetDbContext
{
    DbSet<DigitalAsset> DigitalAssets { get; }
    DbSet<Theme> Themes { get; }
    DbSet<OnCall> OnCalls { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
