// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using Coop.Domain;
using Newtonsoft.Json;
using System;

namespace Coop.Infrastructure.Data;

public class CoopDbContext : DbContext, ICoopDbContext
{
    private readonly INotificationService _notificationService;
    public DbSet<MaintenanceRequest> MaintenanceRequests { get; private set; }
    public DbSet<Notice> Notices { get; private set; }
    public DbSet<ByLaw> ByLaws { get; private set; }
    public DbSet<StaffMember> StaffMembers { get; private set; }
    public DbSet<BoardMember> BoardMembers { get; private set; }
    public DbSet<User> Users { get; private set; }
    public DbSet<Role> Roles { get; private set; }
    public DbSet<DigitalAsset> DigitalAssets { get; private set; }
    public DbSet<Privilege> Privileges { get; private set; }
    public DbSet<Member> Members { get; private set; }
    public DbSet<Profile> Profiles { get; private set; }
    public DbSet<Document> Documents { get; private set; }
    public DbSet<Report> Reports { get; private set; }
    public DbSet<MaintenanceRequestComment> MaintenanceRequestComments { get; private set; }
    public DbSet<MaintenanceRequestDigitalAsset> MaintenanceRequestDigitalAssets { get; private set; }
    public DbSet<Message> Messages { get; private set; }
    public DbSet<Conversation> Conversations { get; private set; }
    public DbSet<JsonContent> JsonContents { get; private set; }
    public DbSet<OnCall> OnCalls { get; private set; }
    public DbSet<Theme> Themes { get; private set; }
    public DbSet<InvitationToken> InvitationTokens { get; private set; }
    public DbSet<StoredEvent> StoredEvents { get; private set; }
    public CoopDbContext(DbContextOptions options, INotificationService notificationService)
        : base(options)
    {
        SavingChanges += CoopDbContext_SavingChanges;
        SavedChanges += DbContext_SavedChanges;
        _notificationService = notificationService;
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CoopDbContext).Assembly);
    }
    private void CoopDbContext_SavingChanges(object sender, SavingChangesEventArgs e)
    {
        var entries = ChangeTracker.Entries<AggregateRoot>()
            .Where(
                e => e.State == EntityState.Added ||
                e.State == EntityState.Modified)
            .Select(e => e.Entity)
            .ToList();
        foreach (var aggregate in entries)
        {
            foreach (var storedEvent in aggregate.StoredEvents)
            {
                StoredEvents.Add(storedEvent);
            }
        }
    }
    private void DbContext_SavedChanges(object sender, SavedChangesEventArgs e)
    {
        var entries = ChangeTracker.Entries<AggregateRoot>()
            .Select(e => e.Entity)
            .ToList();
        foreach (var aggregate in entries)
        {
            foreach (var storedEvent in aggregate.StoredEvents)
            {
                var @event = JsonConvert.DeserializeObject(storedEvent.Data, Type.GetType(storedEvent.DotNetType));
                _notificationService.OnNext(@event);
            }
            aggregate.Clear();
        }
    }
    public override void Dispose()
    {
        SavingChanges -= CoopDbContext_SavingChanges;
        base.Dispose();
    }
    public override ValueTask DisposeAsync()
    {
        SavingChanges -= CoopDbContext_SavingChanges;
        return base.DisposeAsync();
    }
}

