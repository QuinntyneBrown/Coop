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
        }

        public static class AccessRights
        {
            public static List<AccessRight> Read => new() { AccessRight.ReadAccess };
            public static List<AccessRight> ReadWrite => new() { AccessRight.ReadAccess, AccessRight.WriteAccess };

            public static List<AccessRight> FullAccess => new() { AccessRight.ReadAccess, AccessRight.WriteAccess, AccessRight.CreateAccess, AccessRight.DeleteAccess };
        }

        public static class Roles
        {
            public static readonly string Member = nameof(Member);
            public static readonly string Staff = nameof(Staff);
            public static readonly string BoardMember = nameof(BoardMember);
            public static readonly string Admin = nameof(Admin);
        }

        public static class Aggregates
        {
            public static readonly string User = nameof(User);
            public static List<string> All => new()
            {
                User
            };
        }
    }

}
