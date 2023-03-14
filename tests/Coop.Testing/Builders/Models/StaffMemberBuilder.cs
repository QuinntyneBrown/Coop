// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;

namespace Coop.Testing.Builders.Models;

public class StaffMemberBuilder
{
    private StaffMember _staffMember;
    public static StaffMember WithDefaults()
    {
        return new StaffMember(default, default, default, default);
    }
    public StaffMemberBuilder()
    {
        _staffMember = WithDefaults();
    }
    public StaffMember Build()
    {
        return _staffMember;
    }
}

