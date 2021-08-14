using Coop.Api.Models;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Data
{
    public class CoopDbContext: DbContext, ICoopDbContext
    {
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
        public CoopDbContext(DbContextOptions options)
            :base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CoopDbContext).Assembly);
        }
        
    }
}
