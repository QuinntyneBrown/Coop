using Coop.Api.Core;
using Coop.Api.Models;
using Microsoft.AspNetCore.StaticFiles;
using System.Collections.Generic;
using System.Linq;

namespace Coop.Api.Data
{
    public static class SeedData
    {
        public const string MEMBER_USERNAME = "earl.plett@coop.ca";
        public const string MEMBER_AVATAR = "earl.webp";
        public const string BOARD_MEMBER_USERNAME = "natasha.falk@coop.ca";
        public const string BOARD_MEMBER_AVATAR = "natasha.webp";
        public const string STAFF_MEMBER_USERNAME = "marie.enns@coop.ca";
        public const string STAFF_MEMBER_AVATAR = "marie.PNG";
        public const string PASSWORD = "password";

        public static void Seed(CoopDbContext context)
        {
            DigitalAssetConfiguration.Seed(context);

            RoleConfiguration.Seed(context);

            UserConfiguration.Seed(context);

            MemberConfiguration.Seed(context);

            StaffMemeberConfiguration.Seed(context);

            BoardMemberConfiguration.Seed(context);

            ByLawConfiguration.Seed(context);

            NoticeConfiguration.Seed(context);

            ReportsConfiguration.Seed(context);

            MainrenanceRequestConfiguration.Seed(context);
        }

        internal static class RoleConfiguration
        {
            public static void Seed(CoopDbContext context)
            {
                foreach (var roleName in Constants.Roles.All)
                {
                    var role = context.Roles.SingleOrDefault(x => x.Name == roleName);

                    if (role == null)
                    {
                        role = new Role(roleName);

                        var aggregates = Constants.Aggregates.All;

                        var accessRights = Constants.AccessRights.FullAccess;

                        var privileges = aggregates.SelectMany(aggregate => accessRights.Select(accessRight => new Privilege(accessRight, aggregate))).ToList();

                        foreach (var privilege in privileges)
                        {
                            role.Privileges.Add(privilege);
                        }

                        context.Roles.Add(role);

                        context.SaveChanges();
                    }
                }
            }
        }

        internal static class UserConfiguration
        {
            public static void Seed(CoopDbContext context)
            {
                var passwordHasher = new PasswordHasher();


                foreach (var user in new List<User>
                {
                    new User(MEMBER_USERNAME, PASSWORD, passwordHasher),
                    new User(BOARD_MEMBER_USERNAME, PASSWORD, passwordHasher),
                    new User(STAFF_MEMBER_USERNAME, PASSWORD, passwordHasher)
                })
                {
                    var entity = context.Users.SingleOrDefault(x => x.Username == user.Username);

                    var systemAdministratorRole = context.Roles.Single(x => x.Name == Constants.Roles.SystemAdministrator);

                    if (entity == null)
                    {
                        Role role = user.Username switch
                        {
                            MEMBER_USERNAME => context.Roles.Single(x => x.Name == Constants.Roles.Member),
                            STAFF_MEMBER_USERNAME => context.Roles.Single(x => x.Name == Constants.Roles.Staff),
                            BOARD_MEMBER_USERNAME => context.Roles.Single(x => x.Name == Constants.Roles.BoardMember),
                            _ => null
                        };

                        List<Role> roles = user.Username switch
                        {
                            MEMBER_USERNAME => new() { role },
                            STAFF_MEMBER_USERNAME => new() { role },
                            BOARD_MEMBER_USERNAME => new() { role, systemAdministratorRole },
                            _ => new List<Role>()
                        };

                        foreach (var r in roles)
                        {
                            user.Roles.Add(r);
                        }

                        context.Users.Add(user);
                    }
                }


                context.SaveChanges();
            }
        }

        internal static class MemberConfiguration
        {
            public static void Seed(CoopDbContext context)
            {
                var user = context.Users.Single(x => x.Username == MEMBER_USERNAME);

                var profile = new Member(user.UserId, "Earl", "Plett");

                var avatar = context.DigitalAssets.Single(x => x.Name == MEMBER_AVATAR);

                profile.SetAvatar(avatar.DigitalAssetId);

                context.Members.Add(profile);

                user.SetDefaultProfileId(user.Profiles.First().ProfileId);

                user.SetCurrentProfileId(user.Profiles.First().ProfileId);

                context.SaveChanges();
            }
        }

        internal static class BoardMemberConfiguration
        {
            public static void Seed(CoopDbContext context)
            {
                var user = context.Users.Single(x => x.Username == BOARD_MEMBER_USERNAME);

                var profile = new BoardMember(user.UserId, "President", "Natasha", "Falk");

                var avatar = context.DigitalAssets.Single(x => x.Name == BOARD_MEMBER_AVATAR);

                profile.SetAvatar(avatar.DigitalAssetId);

                context.BoardMembers.Add(profile);

                user.SetDefaultProfileId(user.Profiles.First().ProfileId);

                user.SetCurrentProfileId(user.Profiles.First().ProfileId);

                context.SaveChanges();
            }
        }

        internal static class StaffMemeberConfiguration
        {
            public static void Seed(CoopDbContext context)
            {
                var user = context.Users.Single(x => x.Username == STAFF_MEMBER_USERNAME);

                var profile = new StaffMember(user.UserId, "Building Manager", "Marie", "Enns");

                var avatar = context.DigitalAssets.Single(x => x.Name == STAFF_MEMBER_AVATAR);

                profile.SetAvatar(avatar.DigitalAssetId);

                context.StaffMembers.Add(profile);

                user.SetDefaultProfileId(user.Profiles.First().ProfileId);

                user.SetCurrentProfileId(user.Profiles.First().ProfileId);

                context.SaveChanges();
            }
        }

        internal static class DigitalAssetConfiguration
        {
            internal static void Seed(CoopDbContext context)
            {
                foreach (var avatarFile in new string[3] { MEMBER_AVATAR, BOARD_MEMBER_AVATAR, STAFF_MEMBER_AVATAR })
                {
                    if (context.DigitalAssets.SingleOrDefault(x => x.Name == avatarFile) == null)
                    {
                        var provider = new FileExtensionContentTypeProvider();

                        provider.TryGetContentType(avatarFile, out string contentType);

                        var digitalAsset = new DigitalAsset
                        {
                            Name = avatarFile,
                            Bytes = StaticFileLocator.Get(avatarFile),
                            ContentType = contentType
                        };

                        context.DigitalAssets.Add(digitalAsset);

                        context.SaveChanges();
                    }
                }
            }
        }

        internal static class ByLawConfiguration
        {
            internal static void Seed(CoopDbContext context)
            {
                var pdf = "ByLaw.pdf";

                if (context.DigitalAssets.SingleOrDefault(x => x.Name == pdf) == null)
                {
                    var provider = new FileExtensionContentTypeProvider();

                    provider.TryGetContentType(pdf, out string contentType);

                    var digitalAsset = new DigitalAsset
                    {
                        Name = pdf,
                        Bytes = StaticFileLocator.Get(pdf),
                        ContentType = contentType
                    };

                    context.DigitalAssets.Add(digitalAsset);

                    var document = new ByLaw(digitalAsset.DigitalAssetId, "CHFC Guide to Model Occupancy");

                    document.Publish();

                    context.ByLaws.Add(document);

                    context.SaveChanges();

                }
            }
        }

        internal static class NoticeConfiguration
        {
            internal static void Seed(CoopDbContext context)
            {
                var pdf = "Notice.pdf";

                if (context.DigitalAssets.SingleOrDefault(x => x.Name == pdf) == null)
                {
                    var provider = new FileExtensionContentTypeProvider();

                    provider.TryGetContentType(pdf, out string contentType);

                    var digitalAsset = new DigitalAsset
                    {
                        Name = pdf,
                        Bytes = StaticFileLocator.Get(pdf),
                        ContentType = contentType
                    };

                    context.DigitalAssets.Add(digitalAsset);

                    var document = new Notice(digitalAsset.DigitalAssetId, "New Position Opening");

                    document.Publish();

                    context.Notices.Add(document);

                    context.SaveChanges();
                }
            }
        }

        internal static class ReportsConfiguration
        {
            internal static void Seed(CoopDbContext context)
            {
                var pdf = "Report.pdf";

                if (context.DigitalAssets.SingleOrDefault(x => x.Name == pdf) == null)
                {
                    var provider = new FileExtensionContentTypeProvider();

                    provider.TryGetContentType(pdf, out string contentType);

                    var digitalAsset = new DigitalAsset
                    {
                        Name = pdf,
                        Bytes = StaticFileLocator.Get(pdf),
                        ContentType = contentType
                    };

                    context.DigitalAssets.Add(digitalAsset);

                    var document = new Report(digitalAsset.DigitalAssetId, "Econmomic Impact of the Co-operative Sector in Canada");

                    document.Publish();

                    context.Reports.Add(document);

                    context.SaveChanges();

                }
            }
        }

        internal static class MainrenanceRequestConfiguration
        {
            internal static void Seed(CoopDbContext context)
            {

            }
        }
    }
}
