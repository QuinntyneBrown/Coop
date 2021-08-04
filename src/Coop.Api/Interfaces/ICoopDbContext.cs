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
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    }
}
