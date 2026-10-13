using Coop.Domain.Assets;
using Coop.Domain.CMS;
using Coop.Domain.Documents;
using Coop.Domain.EventSourcing;
using Coop.Domain.Identity;
using Coop.Domain.Maintenance;
using Coop.Domain.Messaging;
using Coop.Domain.Onboarding;
using Coop.Domain.Profiles;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Common.Interfaces;

public interface ICoopDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Privilege> Privileges { get; }
    DbSet<ProfileBase> Profiles { get; }
    DbSet<Member> Members { get; }
    DbSet<BoardMember> BoardMembers { get; }
    DbSet<StaffMember> StaffMembers { get; }
    DbSet<MaintenanceRequest> MaintenanceRequests { get; }
    DbSet<MaintenanceRequestComment> MaintenanceRequestComments { get; }
    DbSet<MaintenanceRequestDigitalAsset> MaintenanceRequestDigitalAssets { get; }
    DbSet<Document> Documents { get; }
    DbSet<Notice> Notices { get; }
    DbSet<ByLaw> ByLaws { get; }
    DbSet<Report> Reports { get; }
    DbSet<Conversation> Conversations { get; }
    DbSet<Message> Messages { get; }
    DbSet<DigitalAsset> DigitalAssets { get; }
    DbSet<Theme> Themes { get; }
    DbSet<JsonContent> JsonContents { get; }
    DbSet<InvitationToken> InvitationTokens { get; }
    DbSet<StoredEvent> StoredEvents { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
