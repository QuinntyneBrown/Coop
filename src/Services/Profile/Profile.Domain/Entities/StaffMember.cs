// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Profile.Domain.Enums;

namespace Profile.Domain.Entities;

public class StaffMember : ProfileBase
{
    public string JobTitle { get; private set; } = string.Empty;

    private StaffMember() { }

    public StaffMember(Guid userId, string jobTitle, string firstName, string lastName)
        : base(ProfileType.Staff, userId, firstName, lastName)
    {
        JobTitle = jobTitle;
    }

    public void SetJobTitle(string jobTitle)
    {
        JobTitle = jobTitle;
        UpdatedAt = DateTime.UtcNow;
    }
}
