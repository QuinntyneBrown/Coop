using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Coop.Domain.Authorization;

public static class Operations
{
    public static readonly OperationAuthorizationRequirement Create =
        new() { Name = nameof(Create) };

    public static readonly OperationAuthorizationRequirement Read =
        new() { Name = nameof(Read) };

    public static readonly OperationAuthorizationRequirement Write =
        new() { Name = nameof(Write) };

    public static readonly OperationAuthorizationRequirement Delete =
        new() { Name = nameof(Delete) };
}
