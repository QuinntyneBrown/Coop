// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Profile.Domain.Enums;

namespace Profile.Domain.Entities;

public class Member : ProfileBase
{
    public Address? Address { get; private set; }

    private Member() { }

    public Member(Guid userId, string firstName, string lastName)
        : base(ProfileType.Member, userId, firstName, lastName)
    {
    }

    public void SetAddress(Address address)
    {
        Address = address;
        UpdatedAt = DateTime.UtcNow;
    }
}

public class Address
{
    public string Street { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
}
