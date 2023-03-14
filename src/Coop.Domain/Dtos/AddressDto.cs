
namespace Coop.Domain.Dtos;

public class AddressDto
{
    public string Street { get; set; }
    public int? Unit { get; set; }
    public string City { get; set; }
    public string Province { get; set; }
    public string PostalCode { get; set; }
}
