// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Identity.Domain.Entities;

public class Privilege
{
    public Guid PrivilegeId { get; private set; } = Guid.NewGuid();
    public Guid RoleId { get; private set; }
    public AccessRight AccessRight { get; private set; }
    public string Aggregate { get; private set; } = string.Empty;

    private Privilege() { }

    public Privilege(AccessRight accessRight, string aggregate)
    {
        AccessRight = accessRight;
        Aggregate = aggregate;
    }
}

public enum AccessRight
{
    Read,
    Write,
    Create,
    Delete
}

public static class AggregateConstants
{
    public const string User = nameof(User);
    public const string Role = nameof(Role);
    public const string Member = nameof(Member);
    public const string StaffMember = nameof(StaffMember);
    public const string BoardMember = nameof(BoardMember);
    public const string MaintenanceRequest = nameof(MaintenanceRequest);
    public const string ByLaw = nameof(ByLaw);
    public const string Notice = nameof(Notice);
    public const string Document = nameof(Document);
    public const string Message = nameof(Message);
    public const string DigitalAsset = nameof(DigitalAsset);

    public static readonly string[] All = new[]
    {
        User, Role, Member, StaffMember, BoardMember, MaintenanceRequest,
        ByLaw, Notice, Document, Message, DigitalAsset
    };
}

public static class AccessRightConstants
{
    public static readonly AccessRight[] FullAccess = new[]
    {
        AccessRight.Read, AccessRight.Write, AccessRight.Create, AccessRight.Delete
    };
}
