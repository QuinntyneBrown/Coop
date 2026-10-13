using Coop.Application.Common.Interfaces;
using Coop.Domain.Assets;
using Coop.Domain.CMS;
using Coop.Domain.Common;
using Coop.Domain.Documents;
using Coop.Domain.EventSourcing;
using Coop.Domain.Identity;
using Coop.Domain.Maintenance;
using Coop.Domain.Messaging;
using Coop.Domain.Onboarding;
using Coop.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace Coop.Infrastructure.Persistence;

public class CoopDbContext : DbContext, ICoopDbContext
{
    private readonly INotificationService? _notificationService;

    public CoopDbContext(DbContextOptions<CoopDbContext> options) : base(options) { }

    public CoopDbContext(DbContextOptions<CoopDbContext> options, INotificationService notificationService)
        : base(options)
    {
        _notificationService = notificationService;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Privilege> Privileges => Set<Privilege>();
    public DbSet<ProfileBase> Profiles => Set<ProfileBase>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<BoardMember> BoardMembers => Set<BoardMember>();
    public DbSet<StaffMember> StaffMembers => Set<StaffMember>();
    public DbSet<MaintenanceRequest> MaintenanceRequests => Set<MaintenanceRequest>();
    public DbSet<MaintenanceRequestComment> MaintenanceRequestComments => Set<MaintenanceRequestComment>();
    public DbSet<MaintenanceRequestDigitalAsset> MaintenanceRequestDigitalAssets => Set<MaintenanceRequestDigitalAsset>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Notice> Notices => Set<Notice>();
    public DbSet<ByLaw> ByLaws => Set<ByLaw>();
    public DbSet<Report> Reports => Set<Report>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<DigitalAsset> DigitalAssets => Set<DigitalAsset>();
    public DbSet<Theme> Themes => Set<Theme>();
    public DbSet<JsonContent> JsonContents => Set<JsonContent>();
    public DbSet<InvitationToken> InvitationTokens => Set<InvitationToken>();
    public DbSet<StoredEvent> StoredEvents => Set<StoredEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CoopDbContext).Assembly);

        // TPH for ProfileBase
        modelBuilder.Entity<ProfileBase>()
            .HasDiscriminator(p => p.Type)
            .HasValue<Member>(ProfileType.Member)
            .HasValue<BoardMember>(ProfileType.BoardMember)
            .HasValue<StaffMember>(ProfileType.StaffMember)
            .HasValue<OnCall>(ProfileType.OnCall);

        // Owned Address for ProfileBase
        modelBuilder.Entity<ProfileBase>()
            .OwnsOne(p => p.Address);

        // TPH for Document
        modelBuilder.Entity<Document>()
            .HasDiscriminator<string>("DocumentType")
            .HasValue<Document>("Document")
            .HasValue<Notice>("Notice")
            .HasValue<ByLaw>("ByLaw")
            .HasValue<Report>("Report");

        // Conversation -> Messages relationship
        modelBuilder.Entity<Conversation>()
            .HasMany(c => c.Messages)
            .WithOne()
            .HasForeignKey(m => m.ConversationId);

        // Conversation -> Profiles (join table)
        modelBuilder.Entity<ConversationProfile>()
            .HasKey(cp => new { cp.ConversationId, cp.ProfileId });

        modelBuilder.Entity<Conversation>()
            .HasMany(c => c.Profiles)
            .WithOne()
            .HasForeignKey(cp => cp.ConversationId);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Extract stored events from aggregate roots
        var aggregateRoots = ChangeTracker.Entries<IAggregateRoot>()
            .Where(e => e.Entity.StoredEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var storedEvents = aggregateRoots
            .SelectMany(a => a.StoredEvents)
            .ToList();

        foreach (var se in storedEvents)
        {
            StoredEvents.Add(se);
        }

        foreach (var ar in aggregateRoots)
        {
            ar.ClearStoredEvents();
        }

        var result = await base.SaveChangesAsync(cancellationToken);

        // Publish domain events via notification service
        if (_notificationService != null)
        {
            // We don't have IEvent instances from StoredEvents directly,
            // but we can publish any pending domain events if needed
        }

        return result;
    }
}
