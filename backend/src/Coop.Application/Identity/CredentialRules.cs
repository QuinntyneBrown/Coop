using FluentValidation;

namespace Coop.Application.Identity;

/// <summary>
/// The username and password rules every way of setting a credential
/// applies (L2-REQ-001, L2-REQ-104 AC3, L2-REQ-105).
/// </summary>
public static class CredentialRules
{
    public const int UsernameMinimumLength = 3;
    public const int PasswordMinimumLength = 6;

    public static IRuleBuilderOptions<T, string> Username<T>(this IRuleBuilder<T, string> rule)
        => rule.NotEmpty().MinimumLength(UsernameMinimumLength);

    public static string TakenMessage(string username) => $"The username \"{username}\" is already taken.";

    public static IRuleBuilderOptions<T, string> Password<T>(this IRuleBuilder<T, string> rule)
        => rule.NotEmpty().MinimumLength(PasswordMinimumLength);
}
