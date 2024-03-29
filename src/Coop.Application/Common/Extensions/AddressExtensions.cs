// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Dtos;
using Coop.Domain.Entities;

namespace Coop.Application.Common.Extensions;

public static class AddressExtensions
{
    public static AddressDto ToDto(this Address address)
    {
        return new AddressDto
        {
            Street = address?.Street,
            Unit = address?.Unit,
            City = address?.City,
            Province = address?.Province,
            PostalCode = address?.PostalCode
        };
    }
}

