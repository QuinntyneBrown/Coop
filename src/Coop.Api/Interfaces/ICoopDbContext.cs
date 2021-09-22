using Coop.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;

namespace Coop.Api.Interfaces
{
    public interface ICoopDbContext
    {
        DbSet<MaintenanceRequest> MaintenanceRequests { get; }
        DbSet<Notice> Notices { get; }
        DbSet<ByLaw> ByLaws { get; }
        DbSet<StaffMember> StaffMembers { get; }
        DbSet<BoardMember> BoardMembers { get; }
        DbSet<User> Users { get; }
        DbSet<Role> Roles { get; }
        DbSet<DigitalAsset> DigitalAssets { get; }
        DbSet<Privilege> Privileges { get; }
        DbSet<Member> Members { get; }
        DbSet<Profile> Profiles { get; }
        DbSet<Document> Documents { get; }
        DbSet<Report> Reports { get; }
        DbSet<MaintenanceRequestComment> MaintenanceRequestComments { get; }
        DbSet<MaintenanceRequestDigitalAsset> MaintenanceRequestDigitalAssets { get; }
        DbSet<Message> Messages { get; }
        DbSet<Conversation> Conversations { get; }
        DbSet<JsonContent> JsonContents { get; }
        DbSet<OnCall> OnCalls { get; }
        DbSet<Theme> Themes { get; }
        DbSet<InvitationToken> InvitationTokens { get; }
        DbSet<StoredEvent> StoredEvents { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    }
}
