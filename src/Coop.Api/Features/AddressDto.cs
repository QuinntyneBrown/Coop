using Coop.Core.Dtos;
using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class AddressExtensions
    {
        public static AddressDto ToDto(this Address address)
        {
            return new AddressDto
            {
                Street = address.Street,
                Unit = address.Unit,
                City = address.City,
                Province = address.Province,
                PostalCode = address.PostalCode
            };
        }
    }
}
