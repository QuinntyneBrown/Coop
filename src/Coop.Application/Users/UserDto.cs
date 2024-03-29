// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;

namespace Coop.Application.Features;

public class UserDto
{
    public Guid? UserId { get; set; }
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public List<RoleDto> Roles { get; set; } = new();
    public List<ProfileDto> Profiles { get; set; } = new();
    public Guid? DefaultProfileId { get; set; }
    public ProfileDto? DefaultProfile { get; set; }
}

