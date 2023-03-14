// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Application.Features;

public class InvitationTokenDto
{
    public Guid InvitationTokenId { get; set; }
    public string Value { get; set; }
    public DateTime? Expiry { get; set; }
}

