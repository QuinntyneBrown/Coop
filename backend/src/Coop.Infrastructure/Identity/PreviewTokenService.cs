using System.Buffers.Text;
using System.Security.Cryptography;
using System.Text;
using Coop.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Coop.Infrastructure.Identity;

/// <summary>
/// A preview token is <c>base64url(expiry seconds) "." base64url(HMAC-SHA256(expiry seconds))</c>,
/// keyed by <c>Authentication:JwtKey</c> (ADR 0019). Nothing is stored, so
/// changing the key is the only way to revoke the tokens outstanding.
/// </summary>
public class PreviewTokenService : IPreviewTokenService
{
    private readonly IConfiguration _configuration;

    public PreviewTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string Issue(DateTimeOffset expiresOn)
    {
        var expiry = Encoding.ASCII.GetBytes(expiresOn.ToUnixTimeSeconds().ToString());
        return $"{Base64Url.EncodeToString(expiry)}.{Base64Url.EncodeToString(Sign(expiry))}";
    }

    public bool IsValid(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return false;
        var parts = token.Split('.');
        if (parts.Length != 2)
            return false;

        byte[] expiry;
        byte[] signature;
        try
        {
            expiry = Base64Url.DecodeFromChars(parts[0]);
            signature = Base64Url.DecodeFromChars(parts[1]);
        }
        catch (FormatException)
        {
            return false;
        }

        if (!CryptographicOperations.FixedTimeEquals(signature, Sign(expiry)))
            return false;

        return long.TryParse(Encoding.ASCII.GetString(expiry), out var seconds)
            && DateTimeOffset.FromUnixTimeSeconds(seconds) > DateTimeOffset.UtcNow;
    }

    private byte[] Sign(byte[] expiry)
    {
        var key = Encoding.UTF8.GetBytes(_configuration.GetSection("Authentication")["JwtKey"]!);
        return HMACSHA256.HashData(key, expiry);
    }
}
