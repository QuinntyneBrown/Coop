namespace Coop.Domain.Profiles.ValueObjects;

public class Address
{
    public string Street { get; set; } = string.Empty;
    public string? Unit { get; set; }
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
}
