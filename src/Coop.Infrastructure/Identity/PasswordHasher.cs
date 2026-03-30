using System.Security.Cryptography;
using Coop.Domain.Identity;

namespace Coop.Infrastructure.Identity;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(byte[] salt, string password)
    {
        using var rfc2898 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA1);
        var hash = rfc2898.GetBytes(32);
        return Convert.ToBase64String(hash);
    }
}
