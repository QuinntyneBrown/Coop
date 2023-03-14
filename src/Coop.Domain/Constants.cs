using Coop.Domain.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;

namespace Coop.Domain;

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
    public static class ProfileTypes
    {
        public const string Member = nameof(Member);
        public const string Staff = nameof(Staff);
        public const string BoardMember = nameof(BoardMember);
        public const string SystemAdministrator = nameof(SystemAdministrator);
        public const string Support = nameof(Support);
        public static List<string> All => new() { Member, Staff, BoardMember, SystemAdministrator, Support };
    }
    public static class InvitationTypes
    {
        public const string Member = nameof(Member);
        public const string Staff = nameof(Staff);
        public const string BoardMember = nameof(BoardMember);
        public static List<string> All => new() { Member, Staff, BoardMember };
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
        public const string JsonContent = nameof(JsonContent);
        public const string Theme = nameof(Theme);
        public const string InvitationToken = nameof(InvitationToken);
        public static List<string> All => new()
         {
             BoardMember,
             ByLaw,
             DigitalAsset,
             MaintenanceRequest,
             Member,
             Notice,
             Privilege,
             Report,
             Role,
             StaffMember,
             User,
             Message,
             HtmlContent,
             CssCustomProperty,
             JsonContent,
             Theme,
             InvitationToken
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
    public static class JsonContentName
    {
        public const string Landing = nameof(Landing);
        public const string Hero = nameof(Hero);
        public const string BoardOfDirectors = nameof(BoardOfDirectors);
    }
    public static class JsonContentTypes
    {
        public const string Hero = nameof(Hero);
        public const string BoardOfDirectors = nameof(BoardOfDirectors);
        public static List<string> All => new() { Hero, BoardOfDirectors };
    }
    public static JsonSerializerSettings JsonSerializerSettings => new JsonSerializerSettings
    {
        ContractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy(),
        },
        Formatting = Formatting.Indented
    };
}
