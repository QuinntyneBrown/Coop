// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Document.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Document.Domain.Interfaces;

public interface IDocumentDbContext
{
    DbSet<ByLaw> ByLaws { get; }
    DbSet<Notice> Notices { get; }
    DbSet<Report> Reports { get; }
    DbSet<JsonContent> JsonContents { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
