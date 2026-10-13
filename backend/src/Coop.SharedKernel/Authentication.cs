namespace Coop.SharedKernel;

public class Authentication
{
    public string JwtKey { get; set; } = string.Empty;
    public string JwtIssuer { get; set; } = string.Empty;
    public string JwtAudience { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; }
    public string TokenPath { get; set; } = string.Empty;
    public string AuthType { get; set; } = string.Empty;
}
