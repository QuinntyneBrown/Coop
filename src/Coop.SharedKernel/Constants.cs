namespace Coop.SharedKernel;

public static class Constants
{
    public static class ClaimTypes
    {
        public const string UserId = "UserId";
        public const string Username = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        public const string Privilege = "Privilege";
        public const string Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    }

    public static class Roles
    {
        public const string Member = "Member";
        public const string Staff = "Staff";
        public const string BoardMember = "BoardMember";
        public const string SystemAdministrator = "SystemAdministrator";
        public const string Support = "Support";

        public static readonly string[] All = { Member, Staff, BoardMember, SystemAdministrator, Support };
    }

    public static class Aggregates
    {
        public const string BoardMember = "BoardMember";
        public const string ByLaw = "ByLaw";
        public const string DigitalAsset = "DigitalAsset";
        public const string MaintenanceRequest = "MaintenanceRequest";
        public const string Member = "Member";
        public const string Notice = "Notice";
        public const string Privilege = "Privilege";
        public const string Role = "Role";
        public const string StaffMember = "StaffMember";
        public const string User = "User";
        public const string Report = "Report";
        public const string Message = "Message";
        public const string HtmlContent = "HtmlContent";
        public const string CssCustomProperty = "CssCustomProperty";
        public const string JsonContent = "JsonContent";
        public const string Theme = "Theme";
        public const string InvitationToken = "InvitationToken";

        public static readonly string[] All = { BoardMember, ByLaw, DigitalAsset, MaintenanceRequest, Member, Notice, Privilege, Role, StaffMember, User, Report, Message, HtmlContent, CssCustomProperty, JsonContent, Theme, InvitationToken };
    }

    public static class AccessRights
    {
        public static readonly string[] Read = { "Read" };
        public static readonly string[] ReadWrite = { "Read", "Write" };
        public static readonly string[] FullAccess = { "Read", "Write", "Create", "Delete" };
    }
}
