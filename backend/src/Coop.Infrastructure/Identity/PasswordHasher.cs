using System.Security.Cryptography;
using Coop.Domain.Identity;

namespace Coop.Infrastructure.Identity;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(byte[] salt, string password)
    {
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 10000, HashAlgorithmName.SHA1, 32);
        return Convert.ToBase64String(hash);
    }
}
