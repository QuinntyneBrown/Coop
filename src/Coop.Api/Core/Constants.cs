using System.Collections.Generic;
using Coop.Api.Models;

namespace Coop.Api.Core
{
    public static class Constants
    {
        public static class ClaimTypes
        {
            public const string UserId = nameof(UserId);
            public const string Username = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
            public const string Privilege = nameof(Privilege);
            public const string Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        }

        public static class Images
        {
            public const string Logo = nameof(Logo);
        }

        public static class AccessRights
        {
            public static List<AccessRight> Read => new() { AccessRight.Read };
            public static List<AccessRight> ReadWrite => new() { AccessRight.Read, AccessRight.Write };
            public static List<AccessRight> FullAccess => new() { AccessRight.Read, AccessRight.Write, AccessRight.Create, AccessRight.Delete };
        }

        public static class Roles
        {
            public const string Member = nameof(Member);
            public const string Staff = nameof(Staff);
            public const string BoardMember = nameof(BoardMember);
            public const string SystemAdministrator = nameof(SystemAdministrator);
            public const string Support = nameof(Support);
            public static List<string> All => new() { Member, Staff, BoardMember, SystemAdministrator, Support };
        }

        public static class Aggregates
        {
            public const string BoardMember = nameof(BoardMember);
            public const string ByLaw = nameof(ByLaw);
            public const string DigitalAsset = nameof(DigitalAsset);
            public const string MaintenanceRequest = nameof(MaintenanceRequest);
            public const string Member = nameof(Member);
            public const string Notice = nameof(Notice);
            public const string Privilege = nameof(Privilege);
            public const string Role = nameof(Role);
            public const string StaffMember = nameof(StaffMember);
            public const string User = nameof(User);
            public const string Report = nameof(Report);
            public const string Message = nameof(Message);
            public const string HtmlContent = nameof(HtmlContent);
            public const string CssCustomProperty = nameof(CssCustomProperty);
            public static List<string> All => new()
            {
                BoardMember,
                ByLaw,
                DigitalAsset,
                MaintenanceRequest,
                Member,
                Notice,
                Privilege,
                Role,
                StaffMember,
                User,
                Message,
                HtmlContent,
                CssCustomProperty
            };

            public static List<string> Authenticated => new()
            {

            };

            public static List<string> Board => new()
            {
                ByLaw,
                DigitalAsset,
                MaintenanceRequest,
                Notice,
                Report,
                StaffMember,
                Message
            };
        }
    }

}
