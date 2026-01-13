// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Document.Domain.Entities;
using Document.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Document.Infrastructure.Data;

public class DocumentDbContext : DbContext, IDocumentDbContext
{
    public DbSet<ByLaw> ByLaws => Set<ByLaw>();
    public DbSet<Notice> Notices => Set<Notice>();
    public DbSet<Report> Reports => Set<Report>();
    public DbSet<JsonContent> JsonContents => Set<JsonContent>();

    public DocumentDbContext(DbContextOptions<DocumentDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DocumentDbContext).Assembly);
    }
}
