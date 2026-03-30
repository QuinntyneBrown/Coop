using Coop.Domain.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Coop.Domain.Authorization;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
public class AuthorizeResourceOperationAttribute : Attribute
{
    public AccessRight AccessRight { get; }
    public string Aggregate { get; }

    public AuthorizeResourceOperationAttribute(AccessRight accessRight, string aggregate)
    {
        AccessRight = accessRight;
        Aggregate = aggregate;
    }

    public IAuthorizationRequirement GetRequirement()
    {
        return AccessRight switch
        {
            AccessRight.Read => Operations.Read,
            AccessRight.Write => Operations.Write,
            AccessRight.Create => Operations.Create,
            AccessRight.Delete => Operations.Delete,
            _ => throw new InvalidOperationException($"Unsupported access right: {AccessRight}")
        };
    }
}
