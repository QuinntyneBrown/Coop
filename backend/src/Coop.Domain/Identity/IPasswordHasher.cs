namespace Coop.Domain.Identity;

public interface IPasswordHasher
{
    string HashPassword(byte[] salt, string password);
}
