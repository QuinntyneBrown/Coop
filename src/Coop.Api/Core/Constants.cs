using System.Collections.Generic;
using Coop.Api.Models;

namespace Coop.Api.Core
{
    public static class Constants
    {
        public static class ClaimTypes
        {
            public static readonly string UserId = nameof(UserId);
            public static readonly string Username = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
            public static readonly string Privilege = nameof(Privilege);
            public static readonly string Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
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
            public const string Mailbox = nameof(Mailbox);
            public static List<string> All => new List<string> { Member, Staff, BoardMember, SystemAdministrator, Mailbox };
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
                Message
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
